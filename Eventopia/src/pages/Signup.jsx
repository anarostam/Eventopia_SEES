import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../Client";

const Signup = () => {
    let navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        name: "",
        password: "",
        role: "",
    });

    const roleMapping = {
        admin: 1,
        attendee: 2,
        organizer: 3,
        stakeholder: 4
    };

    function handleChange(event) {
        setFormData((previousData) => ({
            ...previousData,
            [event.target.name]: event.target.value
        }));
    }

    async function handleSubmit(e) { 
        e.preventDefault();
        try{
            const roleNumber = roleMapping[formData.role] || 0;

            const { data, error } = await supabase.auth.Signup({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        name: formData.name,
                        role: roleNumber,
                    },
                },  
            });

            if(error) throw error;

            alert("Check your email for verification link");
            
        
        const { data: insertData, error: insertError} = await supabase
            .from("user")
            .insert({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role,
            });

            if(insertError) throw insertError;
            navigate("/login");
        } catch (error) {
            alert(error.message);
        }
}}
export default Signup;