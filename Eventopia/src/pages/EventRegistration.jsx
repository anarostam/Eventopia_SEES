import { createClient } from "@supabase/supabase-js";
import { supabase } from "../Client";

export async function registerForEvent(userId, eventId) {
    // Check if the user's payment is completed
    const { data: payment, error: paymentError } = await supabase
        .from("payments")
        .select("status")
        .eq("attendeeID", userId)
        .eq("eventID", eventId)
        .maybeSingle();

        console.log("Payment status result:", payment, "Error:", paymentError);
    if (paymentError) {
        console.error("Error checking payment status:", paymentError);
        return { success: false, message: "Error checking payment status" };
    }

    if (!payment || !payment.status) {
        return { success: false, message: "Payment not completed" };
    }

    // Check if user is already registered for the event
    const { data: existingRegistration, error: checkError } = await supabase
        .from("event_register")
        .select("id")
        .eq("userid", userId)
        .eq("eventid", eventId)
        .maybeSingle();
        console.log("Existing registration check:", existingRegistration, "Error:", checkError);
    if (checkError && checkError.code !== "PGRST116") { // Ignore 'No rows found' error
        console.error("Error checking existing registration:", checkError);
        return { success: false, message: "Error checking registration status" };
    }

    if (existingRegistration) {
        return { success: false, message: "User already registered for this event" };
    }

    // Register the user for the event
    const { error: registrationError } = await supabase
        .from("event_register")
        .insert([{ userid: userId, eventid: eventId }]);
        console.log("Event registration insert error:", registrationError);
    if (registrationError) {
        console.error("Error registering for event:", registrationError);
        return { success: false, message: "Error registering for event" };
    }

    // Increment the registered count in the venues table
    const { error: updateError } = await supabase
        .from("event")
        .update({ registered: supabase.sql`registered + 1` })
        .eq("id", eventId);
        console.log("Venue count update error:", updateError);
    if (updateError) {
        console.error("Error updating venue registration count:", updateError);
        return { success: false, message: "Error updating venue count" };
    }

    return { success: true, message: "Successfully registered for event!" };
}

