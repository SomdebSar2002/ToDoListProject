import { createContext, useContext } from "react";
import { useState, useEffect } from "react";
import { supabase } from "./supabase-client";
const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    const [users, setUsers] = useState([]);
    const [authReady, setAuthReady] = useState(false);
    
    useEffect(() => {
        async function getInitialSession() {
            try{
                const {data,error} = await supabase.auth.getSession();
                if(error) throw error;
                setSession(data.session);
                setAuthReady(true);
            }
            catch(error){
                console.error("Error getting initial session:", error.message);
                setAuthReady(true);
            }
        }
        getInitialSession();

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setAuthReady(true);
        })
    },[]);
    useEffect(()=>{
        if(!session)return;
        async function fetchUsers() {
            try{
                const {data,error} = await supabase.from("users").select('id,email,name')
                if(error) throw error;
                setUsers(data);
            }
            catch(error){
                console.error("Error fetching users:", error.message);
            }
        }
        fetchUsers();


    },[session]);

    const signUp = async (email, password, name) => {
        try{
            const {data,error} = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { name }
                },
            })
            if(error) {
                console.error("Error signing up:", error.message);
                return { success: false, error: error.message };
            }
            return { success: true,data};
        }
            catch(error){
                return { success: false, error: error.message };
            }
        }
    const signOut = async () => {
        try{
            const {error} = await supabase.auth.signOut();
            if(error) {
                console.error("Error signing out:", error.message);
                return { success: false, error: error.message };
            }
            return { success: true };
        }
        catch(error){
            console.error("Error signing out:", error.message);
            return { success: false, error: error.message };
        }
    }
    const signIn = async (email,password) => {
        try{
            const {data,error} = await supabase.auth.signInWithPassword({
                email,
                password
            })
            if(error){
                console.error("Error signing in:", error.message);
                return { success: false, error: error.message };
            }
            if (data?.session) {
                setSession(data.session);
            }
            return {success:true,data};
        }
        catch(error){
            console.error("Error signing in:", error.message);
            return { success: false, error: error.message };  
        }
    }
    return (
        <AuthContext.Provider value={{ session, users, authReady, signUp, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}
export function useAuth() {
    return useContext(AuthContext);
}
