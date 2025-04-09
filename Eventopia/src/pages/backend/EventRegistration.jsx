import { createClient } from "@supabase/supabase-js";
import { supabase } from "../../Client";

export async function registerForEvent(userId, eventId) {
    // Check if the user's payment is completed
    const { data: payment, error: paymentError } = await supabase
        .from("payments")
        .select("status")
        .eq("attendeeID", userId)
        .eq("eventID", eventId)
        .limit(1);  // Limit the result to just 1 row

    console.log("Payment status result:", payment);  // Log the data
    console.log("Payment error:", paymentError);

    if (paymentError) {
        console.error("Error checking payment status:", paymentError);
        return { success: false, message: "Error checking payment status" };
    }

    // Handle the case where payment is an array
    if (!payment || payment.length === 0 || payment[0].status !== true) {
        return { success: false, message: "Payment not completed or not found" };
    }

    // Check if user is already registered for the event
    const { data: existingRegistration, error: checkError } = await supabase
        .from("event_register")
        .select("id")
        .eq("userid", userId)
        .eq("eventid", eventId)
        .maybeSingle();  // Only select a single row

    console.log("Existing registration check:", existingRegistration);  // Log existing registration check result
    console.log("Error checking registration:", checkError);  // Log error if any

    if (checkError) {
        console.error("Error checking existing registration:", checkError);
        return { success: false, message: "Error checking registration status" };
    }

    if (existingRegistration) {
        console.log("User is already registered for this event");
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

    // Get the current value of the registered column in the event table
    const { data: eventData, error: fetchEventError } = await supabase
        .from("event")
        .select("registered")
        .eq("id", eventId)
        .single();  // Fetch a single row

    if (fetchEventError) {
        console.error("Error fetching event data:", fetchEventError);
        return { success: false, message: "Error fetching event data" };
    }

    // Increment the registered count by 1
    const newRegisteredCount = eventData.registered + 1;

    // Update the event table with the new registered count
    const { error: updateError } = await supabase
        .from("event")
        .update({ registered: newRegisteredCount })
        .eq("id", eventId);

    console.log("Venue count update error:", updateError);
    if (updateError) {
        console.error("Error updating venue registration count:", updateError);
        return { success: false, message: "Error updating venue count" };
    }

    return { success: true, message: "Successfully registered for event!" };
}