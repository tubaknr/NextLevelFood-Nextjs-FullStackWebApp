"use client";
import { useRef, useState } from "react";
import classes from "./image-picker.module.css";
import Image from "next/image";

export default function ImagePicker({name, label}){
    const [pickedImg, setPickedImg] = useState();

    const imageInput = useRef();

    function handlePickClick(){ // bu fonks neredeyse imageInput click olacak!!
        imageInput.current.click();
    }

    // seçilen resmi preview olarak göstermek için:
    // state ve state'i set edecek fonksiyonun çağrıldığı handler fcn
    function handlePickImage(event){
        const file = event.target.files[0];
        console.log("IMAGEPICKER FILE: ",file);
        console.log("IMAGEPICKER FILE TYPEOF : ", typeof file);


        if (!file){
            setPickedImg(null);
            return;
        }

        const fileReader = new FileReader();
        fileReader.onload = () => { // onload prop, içinde fonks tutar
            setPickedImg(fileReader.result);
        }

        fileReader.readAsDataURL(file);

    }
    
    return(
        <div className={classes.picker}>

            <label htmlFor={name}>
                {label}
            </label>
            
            <div className={classes.controls}>
            
                <div className={classes.preview}>
                    {!pickedImg && <p>No images picked yet.</p>}
                    {pickedImg && 
                        <Image 
                            src={pickedImg}
                            alt="The image selected by the user."
                            fill // yüklenen resmin boyutlarını bilmiyoruz -> fill    
                        />
                    }
                </div>
                <input 
                    className={classes.input}
                    type="file"
                    id={name}
                    accept="image/png, image/jpeg"
                    name={name}
                    ref={imageInput} //bu buton aktive edilmiş olacak (bu tıklanmış gibi)
                    onChange={handlePickImage}
                    required
                    >
                </input>

                <button //user, buradaki güzel butona tılkayacak ama aktive olan buton gizlenen çirkin buton olacak
                    className={classes.button} 
                    type="button" //default submit inaktif olsun.
                    onClick={handlePickClick}
                >
                    Pick an Image
                </button>

            </div>
        </div>
    )
}

