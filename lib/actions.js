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
        instructions: formData.get("instructions"),
        creator: formData.get("name"),
        creator_email: formData.get("email"),
        image: formData.get("image"),
    }
    console.log("IMAGEEE: ", meal.image);
    console.log("TYPEOF IMAGEEE: ", typeof meal.image);
    console.log("TYPEOF IMAGEEE IS FILE? : ", meal.image instanceof File);
    

    if (!meal.creator_email.includes("@") || !meal.creator_email.includes(".")) {
        throw new Error("Invalid email address!");
    }
    
    if (!meal.image) {
        throw new Error("No image uploaded!");
    }

    if (!(meal.image instanceof File)) {
        console.error("meal.image is not a File instance:", meal.image);
        throw new Error("Invalid image uploaded!");
    }

    if (!meal.image.name || !["image/png", "image/jpeg"].includes(meal.image.type)) {
        console.error("Invalid file type or missing name:", meal.image);
        throw new Error("Invalid file type or missing file name!");
    }

    // Dosyanın sunucuya doğru ulaştığını kontrol etmek için
    console.log("Image size : ", meal.image.size);
    console.log("Image type : ", meal.image.type);

    // Veriyi kaydet
    try {
        await saveMeal(meal); // meal.image doğrudan iletiliyor
    } catch (error) {
        console.error("Error during saveMeal:", error);
        throw new Error("Failed to save the meal!");
    }

    redirect('/meals');
}


