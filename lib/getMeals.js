import fs from "node:fs"; // ALLOWS TO WORK WİTH FILESYSTEM!!!
import sql from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";

const db = sql("meals.db");

export async function getMeals(){

    // for loading effect
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // throw new Error("Error!");
    // multiple rows -> .all();
    return db.prepare('SELECT * FROM meals').all();
}


export async function getMeal(slug) {
    // sql injection lara karşı: ... slug=" + slug YAPILMAZ! onun yerine ? konur ve .get(slug) metodu ile çağrılır.
    return db.prepare('SELECT * FROM meals WHERE slug = ?').get(slug);
}

function uniqueSlugFinder(baseSlug){
    const similarSlugs = db.prepare(`SELECT slug FROM meals WHERE slug LIKE ?`).all(`${baseSlug}%`).map(row => row.slug);
    if (!similarSlugs.includes(baseSlug)){
        return baseSlug;
    }
    let counter = 1;
    let newSlug = baseSlug;
    while(similarSlugs.includes(newSlug)){
        newSlug = `${baseSlug}-${counter}`;
        counter++;
    }
    return newSlug; 
}

export async function saveMeal(meal){
    const baseSlug = slugify(meal.title, { lower: true }); // all chars are lowerCase.
    
    const uniqueSlug = uniqueSlugFinder(baseSlug);
    meal.slug = uniqueSlug;

    const cleanInstructions = xss(meal.instructions); // userın yazdığı kısımdaki XSS saldırılarını temizle.
    meal.instructions = cleanInstructions;

    const extension = meal.image.name.split('.').pop(); //jpeg, png, ...
    const fileName = `${meal.slug}.${extension}`

    //
    //create stream to: write data to a certain file:
    const stream = fs.createWriteStream(`public/images/${fileName}`)
    
    const bufferedImage = await meal.image.arrayBuffer(); // promise döner!!! --> await ekle!!! --> tüm fonks async oldu!!!!
    
    // 1.arg = buffer, createWriteStream fcn'unun içine verilen path'e yazılıyor.
    // 2.arg = yazma işlemi bitince aktive edilecek olan fcn.
    stream.write(Buffer.from(bufferedImage), 
        (error) => { //error yoksa ve her şey düzgünse burası NULL olur.
            if(error){ 
                throw new Error('Saving image failed!');
            }
    }); // chunk = buffer edilmiş image istiyor.

    //store in db:
    //db's ar not built for image storing; only the path of the image will be stored in db.
    meal.image = `/images/${fileName}` // all reqs for images are sent to PUBLIC FOLDER AUTOMATICALLY anyways

    db.prepare(`
        INSERT INTO meals
            (title, summary, instructions, creator,  creator_email, image, slug)
        VALUES (
            @title,
            @summary,
            @instructions,
            @creator,
            @creator_email,
            @image,
            @slug
            )
        `).run(meal);
}

