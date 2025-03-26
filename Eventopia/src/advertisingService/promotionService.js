import { supabase } from "../Client.js";
import { EventPromoter } from "./eventPromoter.js";
import { User } from "../User.js";
import { fetchSubscribers } from "./subscriberService.js";
import { EmailSender } from "./emailSender.js";

const emailSender = new EmailSender("re_arMGazsr_2fc89jEodiFyrP43erJGp4u5", "laberge.la@gmail.com");

async function notifySubscribers(eventData) {
  const eventPromoter = new EventPromoter();
  const subscribers = await fetchSubscribers();

  subscribers.forEach((email) => {
    eventPromoter.subscribe(new User(email, emailSender));
  });

  eventPromoter.notify(eventData);
}

// Listen for new events in Supabase
export function listenForEvents() {
  supabase
    .channel("events")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "events" },
      async (payload) => {
        console.log("🆕 New Event:", payload.new);

        const eventData = {
          id: payload.new.id,
          name: payload.new.name,
          description: payload.new.details,
          date: payload.new.date,
        };

        await notifySubscribers(eventData);
      }
    )
    .subscribe();
}