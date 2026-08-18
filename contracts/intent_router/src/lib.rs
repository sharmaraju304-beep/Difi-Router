#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, token, Address, Env, String, Symbol, Vec,
};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum IntentStatus {
    Pending = 0,
    Executing = 1,
    Confirmed = 2,
    Failed = 3,
    Cancelled = 4,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Intent {
    pub id: u64,
    pub user: Address,
    pub token_in: Address,
    pub token_out: Address,
    pub amount_in: i128,
    pub min_amount_out: i128,
    pub max_slippage_bps: u32,
    pub deadline: u64,
    pub execution_type: u32, // 0 = BestPrice, 1 = LowFee, 2 = MEVProtected, 3 = MultiHop
    pub status: IntentStatus,
    pub created_at: u64,
    pub executed_amount_out: i128,
    pub execution_hash: String,
}

#[contracttype]
pub enum DataKey {
    Intent(u64),
    UserIntents(Address),
    IntentCount,
    Admin,
}

#[contract]
pub struct IntentRouterContract;

#[contractimpl]
impl IntentRouterContract {
    /// Initialize the contract with an admin address
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::IntentCount, &0u64);
    }

    /// Submit a new swap intent to the router
    pub fn submit_intent(
        env: Env,
        user: Address,
        token_in: Address,
        token_out: Address,
        amount_in: i128,
        min_amount_out: i128,
        max_slippage_bps: u32,
        deadline: u64,
        execution_type: u32,
    ) -> u64 {
        user.require_auth();

        if amount_in <= 0 {
            panic!("Amount in must be positive");
        }
        if min_amount_out <= 0 {
            panic!("Min amount out must be positive");
        }
        let now = env.ledger().timestamp();
        if deadline <= now {
            panic!("Deadline must be in the future");
        }

        // Get and increment intent count
        let mut count: u64 = env
            .storage()
            .instance()
            .get(&DataKey::IntentCount)
            .unwrap_or(0);
        count += 1;
        env.storage().instance().set(&DataKey::IntentCount, &count);

        let intent = Intent {
            id: count,
            user: user.clone(),
            token_in: token_in.clone(),
            token_out: token_out.clone(),
            amount_in,
            min_amount_out,
            max_slippage_bps,
            deadline,
            execution_type,
            status: IntentStatus::Pending,
            created_at: now,
            executed_amount_out: 0,
            execution_hash: String::from_str(&env, ""),
        };

        // Save intent
        env.storage()
            .persistent()
            .set(&DataKey::Intent(count), &intent);

        // Update user's intent index list
        let user_key = DataKey::UserIntents(user.clone());
        let mut user_list: Vec<u64> = env
            .storage()
            .persistent()
            .get(&user_key)
            .unwrap_or(Vec::new(&env));
        user_list.push_back(count);
        env.storage().persistent().set(&user_key, &user_list);

        // Emit IntentSubmitted event
        env.events().publish(
            (symbol_short!("intent"), symbol_short!("submit")),
            (count, user, token_in, token_out, amount_in, min_amount_out),
        );

        count
    }

    /// Execute a registered intent using calculated path
    pub fn execute_intent(
        env: Env,
        executor: Address,
        intent_id: u64,
        route_dexes: Vec<Symbol>,
        expected_out: i128,
        tx_hash: String,
    ) -> i128 {
        executor.require_auth();

        let intent_key = DataKey::Intent(intent_id);
        let mut intent: Intent = match env.storage().persistent().get(&intent_key) {
            Some(i) => i,
            None => panic!("Intent not found"),
        };

        if intent.status != IntentStatus::Pending {
            panic!("Intent not pending");
        }

        let now = env.ledger().timestamp();
        if now > intent.deadline {
            intent.status = IntentStatus::Failed;
            env.storage().persistent().set(&intent_key, &intent);

            env.events().publish(
                (symbol_short!("intent"), symbol_short!("failed")),
                (intent_id, String::from_str(&env, "Deadline expired")),
            );
            panic!("Intent deadline passed");
        }

        if expected_out < intent.min_amount_out {
            intent.status = IntentStatus::Failed;
            env.storage().persistent().set(&intent_key, &intent);

            env.events().publish(
                (symbol_short!("intent"), symbol_short!("failed")),
                (intent_id, String::from_str(&env, "Slippage tolerance exceeded")),
            );
            panic!("Expected output below min_amount_out");
        }

        // Emit RouteCalculated event
        env.events().publish(
            (symbol_short!("route"), symbol_short!("calc")),
            (intent_id, route_dexes.clone(), expected_out),
        );

        // Update status to Executing
        intent.status = IntentStatus::Executing;
        env.storage().persistent().set(&intent_key, &intent);

        // Perform token transfer from user if tokens are available
        // Transfer input token from user to contract/executor
        let client_in = token::Client::new(&env, &intent.token_in);
        let contract_address = env.current_contract_address();

        // Transfer token_in from user to contract
        client_in.transfer(&intent.user, &contract_address, &intent.amount_in);

        // Transfer output token from contract (or executor) to user
        let client_out = token::Client::new(&env, &intent.token_out);
        client_out.transfer(&contract_address, &intent.user, &expected_out);

        // Update intent status to Confirmed
        intent.status = IntentStatus::Confirmed;
        intent.executed_amount_out = expected_out;
        intent.execution_hash = tx_hash.clone();
        env.storage().persistent().set(&intent_key, &intent);

        // Emit SwapExecuted & TransactionConfirmed events
        env.events().publish(
            (symbol_short!("swap"), symbol_short!("exec")),
            (intent_id, intent.user.clone(), intent.token_in.clone(), intent.token_out.clone(), intent.amount_in, expected_out),
        );

        env.events().publish(
            (symbol_short!("tx"), symbol_short!("confirm")),
            (intent_id, tx_hash, expected_out),
        );

        expected_out
    }

    /// Cancel a pending intent by the user
    pub fn cancel_intent(env: Env, user: Address, intent_id: u64) {
        user.require_auth();

        let intent_key = DataKey::Intent(intent_id);
        let mut intent: Intent = match env.storage().persistent().get(&intent_key) {
            Some(i) => i,
            None => panic!("Intent not found"),
        };

        if intent.user != user {
            panic!("Unauthorized cancellation");
        }

        if intent.status != IntentStatus::Pending {
            panic!("Can only cancel pending intents");
        }

        intent.status = IntentStatus::Cancelled;
        env.storage().persistent().set(&intent_key, &intent);

        env.events().publish(
            (symbol_short!("intent"), symbol_short!("cancel")),
            (intent_id, user),
        );
    }

    /// Get details of a single intent
    pub fn get_intent(env: Env, intent_id: u64) -> Option<Intent> {
        env.storage().persistent().get(&DataKey::Intent(intent_id))
    }

    /// Get list of intent IDs submitted by a user
    pub fn get_user_intents(env: Env, user: Address) -> Vec<u64> {
        env.storage()
            .persistent()
            .get(&DataKey::UserIntents(user))
            .unwrap_or(Vec::new(&env))
    }

    /// Get total number of registered intents
    pub fn get_total_intents(env: Env) -> u64 {
        env.storage()
            .instance()
            .get(&DataKey::IntentCount)
            .unwrap_or(0)
    }
}
