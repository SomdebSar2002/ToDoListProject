import { createContext, useContext } from "react";
import { useState, useEffect } from "react";
import { supabase } from "./supabase-client";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [email, setEmail] = useState(null);
    const [username, setUsername] = useState(null);
    const signUpNewUser = async ({ email, password, username }) => {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password
        })
        if (error) {
            console.error("There was an error signing up: ", error);
            return { success: false, error };
        } else {
            setEmail(email);
            setUsername(username);
            return { success: true, data };
        }
    }
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        })
        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        })
        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        })
    }, [])
    const signIn = async ({ email, password }) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        if (error) {
            console.error("Error signing in: ", error);
            return { success: false, error };
        } else {
            setEmail(email);
            return { success: true, data };
        }
    }
    const signOut = async () => {
        await supabase.auth.signOut();
        setSession(null);
        setEmail(null);
        setUsername(null);
        navigate('/signin');
    }
    return (
        <AuthContext.Provider value={{ session, email, username, signUpNewUser, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}
export function useAuth() {
    return useContext(AuthContext);
}