"use client";
import Link from "next/link";
import classes from "./nav-link.module.css";
import { usePathname } from "next/navigation";

// This small piece of code was about to turn my server-side code into a client-side!
export default function NavLink({children, href}){

    const path = usePathname();
    
    return(
        <Link 
            href={href} 
            className={path.startsWith(href) ? `${classes.link} ${classes.active}` : classes.link}>
            {children}
        </Link>
    )
}
