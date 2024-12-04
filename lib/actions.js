"use server";

import { redirect } from "next/navigation";
import { saveMeal } from "./getMeals";
import { revalidatePath } from "next/cache";

//INPUT VALIDATION
function isInvalidText(text){
    return !text || text.trim() === "";
}

// SERVER ACTIONS 

export async function shareMeal(prevState, formData){
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

    //INPUT VALIDATION
    if(
        meal.image.size === 0 || 
        !meal.image
    )
    {
        return{
            message: 'Invalid image'
        };
    }

    if(isInvalidText(meal.title)){ return{ message: 'Invalid title!'}};
    if(isInvalidText(meal.summary)){ return{ message: 'Invalid summary!'}};
    if(isInvalidText(meal.instructions)){ 
        console.log("INSTRACTTTT: ", instructions);
        return{ message: 'Invalid instructions!'}};
    if(isInvalidText(meal.creator)){ return{ message: 'Invalid creator!'}};
    if(isInvalidText(meal.creator_email) || !meal.creator_email.includes("@")){ return{ message: 'Invalid creator email!'}};

    // Veriyi kaydet
    try {
        await saveMeal(meal); // meal.image doğrudan iletiliyor
    } catch (error) {
        console.error("Error during saveMeal:", error);
        throw new Error("Failed to save the meal!");
    }
    revalidatePath('/meals'); // throw the old caches and excute the fcns required to be executed again in production
    redirect('/meals');
}


