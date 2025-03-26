import { supabase } from "../Client";

// Uploads a profile picture and updates the user's profilepic column
export const uploadProfilePicture = async (file) => {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) throw userError || new Error("User not found");

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("profilepictures")
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: publicUrlData, error: urlError } = await supabase.storage
      .from("profilepictures")
      .getPublicUrl(filePath);

    if (urlError) throw urlError;

    const { error: updateError } = await supabase
      .from("user")
      .update({ profilepic: filePath })
      .eq("id", user.id);

    if (updateError) throw updateError;

    return { success: true, publicUrl: publicUrlData.publicUrl };
  } catch (error) {
    console.error("Upload error:", error.message);
    return { success: false, message: error.message };
  }
};

// Fetches user email and profile picture URL
export const fetchUserProfile = async () => {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) throw authError || new Error("User not found");

    const { data: userData, error: userFetchError } = await supabase
      .from("user")
      .select("id, email, profilepic")
      .eq("id", user.id)
      .single();

    if (userFetchError || !userData) throw userFetchError || new Error("No user data found");

    let publicUrl = null;

    if (userData.profilepic) {
      const { data } = supabase.storage
        .from("profilepictures")
        .getPublicUrl(userData.profilepic);
      publicUrl = data.publicUrl;
    }

    return {
      success: true,
      data: {
        email: userData.email,
        profilepic: publicUrl,
      },
    };
  } catch (error) {
    console.error("Fetch profile error:", error.message);
    return { success: false, message: error.message };
  }
};
