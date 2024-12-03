"use server";

import { redirect } from "next/navigation";
import { saveMeal } from "./getMeals";

// SERVER ACTIONS 

export async function shareMeal(formData){
    const meal = { 
        // aşağıda <input name="xxx" .../> yazılanlardaki NAMElerden çekiliyor.
        // get(NAME)
        title: formData.get("title"),
        summary: formData.get("summary"),
        creator_email: formData.get("email"),
        instructions: formData.get("instructions"),
        image: formData.get("image"),
        creator: formData.get("name")
    }

    await saveMeal(meal); //promise donecek --> await --> async

    redirect('/meals');
}


