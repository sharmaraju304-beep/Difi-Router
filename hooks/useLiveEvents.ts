import { useEffect } from "react";
import { useIntentStore } from "@/store/useIntentStore";
import { eventSubscriber } from "@/lib/stellar/events";

export function useLiveEvents() {
  const activityFeed = useIntentStore((s) => s.activityFeed);
  const addActivityEvent = useIntentStore((s) => s.addActivityEvent);

  useEffect(() => {
    const unsubscribe = eventSubscriber.subscribe((event) => {
      addActivityEvent(event);
    });
    return () => unsubscribe();
  }, [addActivityEvent]);

  return {
    activityFeed,
  };
}
