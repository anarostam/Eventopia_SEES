import { supabase } from "../Client.js";
import { EventPromoter } from "./eventPromoter.js";
import { User } from "./user.js";
import { fetchSubscribers } from "./subscriberService.js";

async function notifySubscribers(eventData) {
  const eventPromoter = new EventPromoter();
  const subscribers = await fetchSubscribers();

  subscribers.forEach((email) => {
    eventPromoter.subscribe(new User(email));
  });

  eventPromoter.notify(eventData);
}

// Listen for new events in Supabase
export function listenForEvents() {
  supabase
    .channel("event")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "event" },
      async (payload) => {
        console.log("🆕 New Event:", payload.new);

        const eventData = {
          id: payload.new.id,
          name: payload.new.name,
          description: payload.new.description,
          date: payload.new.date,
          time: payload.new.time,
        };

        await notifySubscribers(eventData);
      }
    )
    .subscribe();
}