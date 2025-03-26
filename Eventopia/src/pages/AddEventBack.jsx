// //import supabase from "../../supabase/client";
// import {supabase} from "../Client";

// // Uploads image to Supabase Storage & inserts event into DB
// export const AddEventBack = async ({ name, date, time, venue, description, picture }) => {
//   try {
//     // Step 1: Upload picture to Supabase Storage
//     let pictureUrl = "";

//     if (picture) {
//       const fileName = `${Date.now()}_${picture.name}`;
//       const { data: storageData, error: storageError } = await supabase
//         .storage
//         .from("eventpictures") // make sure this bucket exists
//         .upload(fileName, picture);

//       if (storageError) throw storageError;

//       const { data: publicUrl } = supabase
//         .storage
//         .from("eventpictures")
//         .getPublicUrl(fileName);

//       pictureUrl = publicUrl.publicUrl;
//     }

//     // Step 2: Insert event into the "events" table
//     // const { data, error } = await supabase
//     //   .from("event")
//     //   .insert({
//     //     event_name: name,
//     //     date: date,
//     //     time: time,
//     //     venue: venue,
//     //     description: description,
//     //     picture_url: pictureUrl,
//     //   });

//     const { data, error } = await supabase
//   .from("event")
//   .insert({
//     name,                // ✅ matches your "name" column
//     date,
//     time,
//     venue,
//     description,
//    // picture_url, //❌ not in your schema!
//   });


//     if (error) throw error;

//     return { success: true, data };
//   } catch (err) {
//     return { success: false, message: err.message };
//   }
// };





/////////////////////////////////////////////////////////


// import { supabase } from "../Client";

// export const AddEventBack = async ({ eventName, date, time, venue, description, picture }) => {
//   try {
//     let pictureUrl = "";

//     // Upload image to Supabase Storage
//     if (picture) {
//       const fileName = `${Date.now()}_${picture.name}`;
//       const { error: storageError } = await supabase
//         .storage
//         .from("eventpictures")
//         .upload(fileName, picture);

//       if (storageError) throw storageError;

//       const { data: publicUrl } = supabase
//         .storage
//         .from("eventpictures")
//         .getPublicUrl(fileName);

//       pictureUrl = publicUrl.publicUrl;
//     }

//     // Insert into the "event" table (ensure column names match Supabase schema)
//     const { data, error } = await supabase
//       .from("event")
//       .insert({
//         name: eventName,
//         date,
//         time,
//         venue,
//         description,
//         picture_url: pictureUrl,
//       });

//     if (error) throw error;

//     return { success: true, data };
//   } catch (err) {
//     return { success: false, message: err.message };
//   }
// };


/////////////////////////
import { createClient } from '@supabase/supabase-js';

// Replace with your actual Supabase project values
const supabase = createClient(
  'https://fkbflmyfughlgxnzuazy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrYmZsbXlmdWdobGd4bnp1YXp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyOTk0MTQsImV4cCI6MjA1NDg3NTQxNH0.GQCJ-XBiyZAD2tVXVwY_RWFaF6dHejPGKW5jy6p0deA'
);

export const AddEventBack = async ({ eventName, date, time, venue, description, picture }) => {
  try {
    // Step 1: Upload picture to Supabase Storage
    let pictureUrl = null;

    if (picture) {
      const fileExt = picture.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `event-pictures/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('event-pictures')
        .upload(filePath, picture);

      if (uploadError) {
        console.error('Image upload failed:', uploadError.message);
        return { success: false, message: 'Image upload failed' };
      }

      const { data: publicUrlData } = supabase.storage
        .from('event-pictures')
        .getPublicUrl(filePath);

      pictureUrl = publicUrlData.publicUrl;
    }

    // Step 2: Insert event into the `event` table
    // const { error: insertError } = await supabase.from('event').insert([
    //   {
    //     name: eventName,
    //     date,
    //     time,
    //     venue,
    //     description,
    //     picture_url: pictureUrl,
    //   },
    // ]);

    // if (insertError) {
    //   console.error('Insert failed:', insertError.message);
    //   return { success: false, message: 'Failed to add event' };
    // }

    // Step 2: Insert event into the `event` table
console.log('Inserting into event table with:', {
    name: eventName,
    date,
    time,
    venue,
    description,
    picture_url: pictureUrl,
  });
  
  const { error: insertError } = await supabase.from('event').insert([
    {
      name: eventName,
      date,
      time,
      venue,
      description,
      picture_url: pictureUrl,
    },
  ]);
  
//   if (insertError) {
//     console.error('Insert failed:', insertError);
//     return { success: false, message: 'Failed to add event' };
//   }
  
if (insertError) {
    console.error('Insert failed:', insertError); // Show the full error
    return { success: false, message: insertError.message || 'Unknown error' };
  }
  
    return { success: true };
  } catch (error) {
    console.error('Unexpected error:', error.message);
    return { success: false, message: 'Unexpected error occurred' };
  }
};
