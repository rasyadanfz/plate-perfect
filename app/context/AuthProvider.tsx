import React, { useState, useEffect } from "react";
import { supabase } from "../db/supabaseClient";
import { User } from "@supabase/supabase-js";

interface contextInterface {
    user: User | null;
    signUp: (email: string, password: string) => Promise<User | null | undefined>;
    signIn: (email: string, password: string) => Promise<User | undefined>;
    signOut: () => Promise<any>;
}

const AuthContext = React.createContext({} as contextInterface);

const useAuth = () => {
    return React.useContext(AuthContext);
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getCurrentSession = async () => {
            const { data, error } = await supabase.auth.getSession();
            setUser(data?.session?.user ?? null);
            setLoading(false);

            const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
                setUser(session?.user ?? null);
                setLoading(false);
            });

            authListener.subscription.unsubscribe();
        };
        getCurrentSession();
    }, []);

    const signUp = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({ email: email, password: password });
        if (error) {
            throw error;
        } else {
            return data.user;
        }
    };

    const signIn = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
        if (error) {
            throw error;
        } else {
            setUser(data.user);
            return data.user;
        }
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.log("Error signing out: ", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, signUp, signIn, signOut }}>{children}</AuthContext.Provider>
    );
};

export default AuthProvider;
export { useAuth };
