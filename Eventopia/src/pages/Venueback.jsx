import { supabase } from "../Client";

export const Venue = async ({venueName, location, capacity, picture}) => {
    try{
        let pictureUrl = null;

        if(picture) {
            const fileExt = picture.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `venuepictures/${fileName}`;

            const { error: uploadError } = await supabase.storage
            .from('venuepictures')
            .upload(filePath, picture);

            if(uploadError) {
                console.error('Image uplaod failed:', uploadError.message);
                return {success: false, message: 'Image upload failed'};
            }

            const {data: publicUrlData } = supabase.storage
            .from('venuepictures')
            .getPublicUrl(filePath);

            pictureUrl = publicUrlData.publicUrl;
        }
        console.log("Inserting into venue table");

        const {error: insertError } = await supabase
        .from('venues')
        .insert([
            {
                venue_name: venueName,
                location,
                capacity,
                venuepicture: pictureUrl,
            },
        ]);

        if(insertError){
            console.error('Insert failed:', insertError);
            return { success: false, message: insertError.messagee || 'Unkown error'};
        }

        return { success: true };
    } catch (error){
        console.error('Unexpected error:', error.message);
        return { success: false, message: 'Unexpected error occurred'};
    }
  

};

export const updateVenue = async ({id, venue_name, location, capacity, picture}) => {

try{
  let pictureUrl = null;

  if (picture) {
      const fileExt = picture.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `venuepictures/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('venuepictures')
        .upload(filePath, picture);

      if (uploadError) {
        console.error('Image upload failed:', uploadError.message);
        return { success: false, message: 'Image upload failed' };
      }

      const { data: publicUrlData } = await supabase.storage
        .from('venuepictures')
        .getPublicUrl(filePath);

      pictureUrl = publicUrlData.publicUrl;
    }
    const updateFields = {};

  if (venue_name) updateFields.venueName = venue_name;
  if (location) updateFields.location = location;
  if (capacity) updateFields.capacity = capacity;
  if (pictureUrl) updateFields.venuepicture = pictureUrl;

  const { error: updateError } = await supabase
    .from('venues')
    .update(updateFields)
    .eq('id', id); 

  if (updateError) {
    console.error('Update failed:', updateError.message);
    return { success: false, message: updateError.message || 'Unknown error' };
  }

  return { success: true };
} catch (error) {
  console.error('Unexpected error:', error.message);
  return { success: false, message: 'Unexpected error occurred' };
}
};
export const deleteVenue = async (id) => {
    try {
      const { error: deleteError } = await supabase
        .from('venues')
        .delete()
        .eq('id', id);
  
      if (deleteError) {
        console.error('Delete failed:', deleteError.message);
        return { success: false, message: deleteError.message || 'Unknown error' };
      }
  
      return { success: true };
    } catch (error) {
      console.error('Unexpected error:', error.message);
      return { success: false, message: 'Unexpected error occurred' };
    }
  };
  
export const fetchVenues = async () => {
    try{
        const { data, error } = await supabase
        .from('venues')
        .select('*');

        if(error) {
            console.error('Fetch failed:', error.message);
            return { success: false, message: error.message || 'Unkown error' };
        }

        return { success: true, data };
    }catch (error) {
        console.error('Unexpected error:', error.message);
        return { success: false, message: 'Unexpected error occured!'};
    }
};