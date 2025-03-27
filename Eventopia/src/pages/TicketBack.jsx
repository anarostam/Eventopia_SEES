// import { supabase } from "../Client";

// export const fetchUserPayments = async (attendeeId) => {
//   try {
//     const { data, error } = await supabase
//       .from("payments")
//       .select(`
//         id,
//         amount,
//         status,
//         created_at,
//         attendee:attendeeID (
//           name, email
//         ),
//         event:eventID (
//           name,
//           date,
//           time,
//           venue,
//           description,
//           picture_url,
//           price
//         )
//       `)
//       .eq("attendeeID", attendeeId);

//     if (error) {
//       console.error("Error fetching payments:", error);
//       return [];
//     }

//     return data;
//   } catch (error) {
//     console.error("Unexpected error:", error.message);
//     return [];
//   }
// };