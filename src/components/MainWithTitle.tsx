import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface ChildrenProps {
    children: React.ReactNode,
}

export const MainWithTitle = ( { children } : ChildrenProps )  =>  { 
    const theLocation = useLocation();
    const currentLocation = theLocation.pathname

    useEffect(() => {
        const page = `${currentLocation.replace('/', '')}`
        document.title = `${page} [HashStrat] self-sovereign crypto investment fund on the blockchain`
    }, [currentLocation])
  
    return (
        <main>
            {children}
        </main>
    )
}