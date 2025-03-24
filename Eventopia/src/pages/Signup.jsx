
import { supabase } from "../Client";


   export function handleChange(event, setFormData) {
        
        const { name, value } = event.target;

        setFormData((previousData) => {
        const updatedData = { ...previousData, [name]: value };

        
        if (updatedData.password1 && updatedData.password2 && updatedData.password1 === updatedData.password2) {
            updatedData.password = updatedData.password1; 
        } else {
            updatedData.password = ""; 
        }

        return updatedData;
    });
    };

    export async function handleSubmit(event, formData) {
        
    
        event.preventDefault();
        console.log("form:", formData);
       
        const roleMapping = {
            admin: 1,
            attendee: 2,
            organizer: 3,
            stakeholder: 4
        };
        try{
            const roleNumber = roleMapping[formData.role] || 0;

            const { error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                // name: formData.name,
                // role: roleNumber,
                    
                
            });

            if(error) throw error;

            alert("Check your email for verification link");
            
        
        const { insertError, data: insertedData} = await supabase
            .from("user")
            .insert({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: roleNumber,
            });

            if(insertError){
                console.log("error inserting", insertError.message);
                alert("error inserting");
                 throw insertError;}
                 console.log("data submitted", insertedData);
                //  alert("added successfully");

        } catch (error) {
            alert(error.message);
        }
};
