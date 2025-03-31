import {supabase} from "../Client";

export const loginUser = async ({ email, password }) => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return { success: false, message: authError.message };
    }

    const userId = authData.user.id;

    // Fetch the user's full data from your 'user' table
    const { data: userData, error: userError } = await supabase
      .from("user")
      .select("name, role") // fetch more fields if needed
      .eq("email", email)
      .single();

    if (userError || !userData) {
      return { success: false, message: "User profile not found." };
    }

    return {
      success: true,
      user: {
        ...authData.user,
        name: userData.name,
        role: userData.role,
      },
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
};
