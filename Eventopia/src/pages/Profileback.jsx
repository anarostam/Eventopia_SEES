import { useState, useEffect } from 'react';
import { supabase } from "../Client";

const Profile = () => {
    const [userEmail, setUserEmail] = useState("");
    const [imgurl, setimgurl] = useState("");
useEffect(() => {
    const fetchData = async () => {
        try {
            const { data: userResponse, error: userError } = await supabase.auth.getUser();
            if(userError || !userResponse?.user) {
                console.error("Error fetching user:", userError || "User not found.");
                throw new Error(userError || "User not found.");
            }

            const user = userResponse.user;
            setUserEmail(user.email);

            const { data: userData, error: userFetchError } = await supabase
            .from("user")
            .select("id, profilepic")
            .eq("email", user.email)
            .single();

            if (userFetchError || !userData) {
                console.error("Error fetching user data:", userFetchError || "No user data found.");
                throw new Error(userFetchError || "No user data found.");
            }

            const userId = userData.id;

            if(userData.profilepic) {
                try {
                    const { data: profilePicData, error: downloadError } = await supabase.storage
                    .from("profilepictures")
                    .download(userData.profilepic);
                    if (downloadError || !profilePicData) {
                        console.error("Error downloading profile picture:", downloadError || "No profile picture found.");
                        throw new Error(downloadError || "No profile picture found.");
                    }

                    const url = URL.createObjectURL(profilePicData);
                    setimgurl(url);
                }catch (error) {
                    console.log("Error processing profile picture:", error);
                }
            }
        }catch (error) {
            console.log("something went wrong", error.message);
        }
    };

    fetchData();
}, []);
}

export default Profile;