 import { supabase } from "../Client";

export const ProfileBackend = {
  async getUserProfile(userEmail) {
    try {
      const { data, error } = await supabase
        .from("user")
        .select("id")
        .eq("email", userEmail)
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching profile data:", error.message);
      return null;
    }
  },

  async uploadProfilePicture(file, userEmail) {
    try {
      const userProfile = await this.getUserProfile(userEmail);
      if (!userProfile?.id) throw new Error("User not found");

      const userId = userProfile.id;
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}.${fileExt}`;
      const filePath = `profilepictures/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("profilepictures")
        .upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: publicData, error: urlError } = await supabase.storage
        .from("profilepictures")
        .getPublicUrl(filePath);
      if (urlError) throw urlError;

      const profilePicURL = publicData.publicUrl;

      const { error: updateError } = await supabase
        .from("user")
        .update({ profilepic: profilePicURL })
        .eq("id", userId);
      if (updateError) throw updateError;

      return profilePicURL;
    } catch (error) {
      console.error("Error uploading profile picture:", error.message);
      return null;
    }
  }
};
