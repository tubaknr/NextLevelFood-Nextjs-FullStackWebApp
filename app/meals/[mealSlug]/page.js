import { getMeal } from "@/lib/getMeals"
import classes from "./page.module.css";
import Image from "next/image";
import { notFound } from "next/navigation";

// Generate metadata for dynamic page [mealSlug]
export async function generateMetadata({params}) {
    const meal = await getMeal(params.mealSlug);

    if(!meal){ // http://localhost:3000/meals/not-found-meal-name
        notFound();
    }

    return{
        title: meal.title,
        description: meal.summary
    };
}   


export default async function MealDetailsPage({params}){

    const meal = await getMeal(params.mealSlug);
    console.log(meal);

    if (!meal){
       notFound(); // en yakındaki not-found sayfasını yükle.    
    }

    // Tarifteki satır aralarını bas:
    meal.instructions = meal.instructions.replace(/\n/g, '<br/>');

    return(
        <>
            <header className={classes.header}>
                <div className={classes.image}>
                    <Image src={meal.image}
                           fill />
                </div>
                <div className={classes.headerText}>
                    <h1>{meal.title}</h1>
                    <p className={classes.creator}>
                        by <a href={`mailto:${meal.creator_email}`}>{meal.creator}</a>
                    </p>
                    <p className={classes.summary}>{meal.summary}</p>
                </div>
            </header>
            
            
            <main>
                <p className={classes.instructions} 
                    dangerouslySetInnerHTML={{
                      __html: meal.instructions,  
                    }}>

                </p>
            </main>
        </>
    )
}
