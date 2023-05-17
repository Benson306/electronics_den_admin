import React, { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }){
    const [authUser, setAuthUser] = useState(null);


    const login = (user) =>{
        setAuthUser(user);
        localStorage.setItem('user', user)
    }

    const logout = (user)=>{
        setAuthUser(null);
        localStorage.removeItem('user')
    }

    const isLoggedIn = () =>{
        let email = localStorage.getItem('user');

        if(email){
            setAuthUser(email);
        }
    }

    useEffect(()=>{
        isLoggedIn();
    },[])

    return (<AuthContext.Provider  value={{login, logout, authUser}}>{children}</AuthContext.Provider>)
}