#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Env, String};

#[test]
fn test_submit_and_get_intent() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, IntentRouterContract);
    let client = IntentRouterContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let user = Address::generate(&env);
    let token_in = Address::generate(&env);
    let token_out = Address::generate(&env);

    client.initialize(&admin);

    let deadline = env.ledger().timestamp() + 3600;
    let intent_id = client.submit_intent(
        &user,
        &token_in,
        &token_out,
        &1000_0000000i128,
        &950_0000000i128,
        &50u32,
        &deadline,
        &0u32,
    );

    assert_eq!(intent_id, 1);

    let intent_option = client.get_intent(&1);
    assert!(intent_option.is_some());
    let intent = intent_option.unwrap();
    assert_eq!(intent.user, user);
    assert_eq!(intent.amount_in, 1000_0000000i128);
    assert_eq!(intent.status, IntentStatus::Pending);

    let user_intents = client.get_user_intents(&user);
    assert_eq!(user_intents.len(), 1);
    assert_eq!(user_intents.get(0).unwrap(), 1);
}
