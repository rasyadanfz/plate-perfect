import React, { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import axios, { AxiosError } from "axios";
import { BACKEND_URL } from "@env";
import { jwtDecode } from "jwt-decode";
import { Professional, User } from "../../types/dbTypes";
import { Redirect } from "expo-router";

interface contextInterface {
    user: User | Professional | null | undefined;
    isAuthenticated: boolean;
    accessToken: string | null;
    role: string;
    signUp: (email: string, password: string, isProfessional: boolean) => Promise<boolean>;
    signIn: (email: string, password: string, isProfessional: boolean) => Promise<boolean>;
    signOut: () => Promise<boolean>;
    fetchUserData: () => Promise<void>;
}

const AuthContext = React.createContext({} as contextInterface);

const useAuth = () => {
    return React.useContext(AuthContext);
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [role, setRole] = useState("USER");
    const [user, setUser] = useState<User | Professional | null | undefined>();
    const [accessToken, setAccessToken] = useState<string | null>("");
    const [refreshToken, setRefreshToken] = useState<string | null>("");
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const initAuth = async () => {
            const storedAccessToken = await SecureStore.getItemAsync("accessToken");
            const storedRefreshToken = await SecureStore.getItemAsync("refreshToken");

            if (storedAccessToken && storedRefreshToken) {
                setAccessToken(storedAccessToken);
                setRefreshToken(storedRefreshToken);
                setIsAuthenticated(true);
                await checkTokenExpiration(storedAccessToken);
            }
        };

        initAuth();

        return () => {
            // cleanup
            clearTimeout;
        };
    }, []);

    const signUp = async (email: string, password: string, isProfessional: boolean) => {
        const backendRegister = await axios({
            method: "POST",
            url: `${BACKEND_URL}/api/auth/register`,
            data: { email: email, password: password, isProfessional: isProfessional },
        });

        if (backendRegister.status === 200) {
            return true;
        } else {
            return false;
        }
    };

    const signIn = async (email: string, password: string, isProfessional: boolean) => {
        try {
            const backendLogin = await axios({
                method: "POST",
                url: `${BACKEND_URL}/api/auth/login`,
                data: { email: email, password: password, isProfessional: isProfessional },
            });

            if (backendLogin.status === 200) {
                const accessToken = backendLogin.data.token;
                const refreshToken = backendLogin.data.refreshToken;
                await saveTokens(accessToken, refreshToken);
                setAccessToken(accessToken);
                setRefreshToken(refreshToken);
                setIsAuthenticated(true);
                checkTokenExpiration(accessToken);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.log("SIGNIN ERROR: ", error);
            return false;
        }
    };

    const signOut = async () => {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");
        const accessToken = await SecureStore.getItemAsync("accessToken");

        try {
            const backendSignOut = await axios({
                method: "POST",
                url: `${BACKEND_URL}/api/auth/logout`,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                data: {
                    token: refreshToken,
                },
            });

            if (backendSignOut.status === 204) {
                setAccessToken(null);
                setRefreshToken(null);
                setIsAuthenticated(false);
                setUser(null);
                await SecureStore.deleteItemAsync("accessToken");
                await SecureStore.deleteItemAsync("refreshToken");
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const checkTokenExpiration = async (accessToken: string) => {
        const decoded = jwtDecode(accessToken);
        const currentTime = Math.floor(Date.now() / 1000);
        try {
            if (decoded.exp! < currentTime) {
                // Token is expired
                const newAccessToken = await refreshAccessToken(refreshToken as string);
                if (newAccessToken) {
                    setAccessToken(newAccessToken);
                    await SecureStore.setItemAsync("accessToken", newAccessToken);
                    checkTokenExpiration(newAccessToken);
                } else {
                    const signedOut = await signOut();
                }
            } else {
                const timeout = (decoded.exp! - currentTime - 60) * 1000; // 1 Minute before token expiration
                setTimeout(() => checkTokenExpiration(accessToken), timeout);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchUserData = async (diffAccessToken?: string) => {
        try {
            const user = await axios({
                method: "GET",
                url: `${BACKEND_URL}/api/auth/me`,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${diffAccessToken ? diffAccessToken : accessToken}`,
                },
            });
            console.log("FETCH USER DATA:", user.data);
            if (user.data.role == "USER") {
                setRole("USER");
                setUser(user.data.data as User);
            } else if (user.data.role == "PROFESSIONAL") {
                setRole("PROFESSIONAL");
                setUser(user.data.data as Professional);
            }
        } catch (error) {
            console.log("FETCH USER DATA ERROR: ", error);
        }
    };

    return (
        <AuthContext.Provider
            value={{ signUp, signIn, signOut, fetchUserData, user, isAuthenticated, accessToken, role }}
        >
            {children}
        </AuthContext.Provider>
    );
};

const saveTokens = async (accessToken: string, refreshToken: string) => {
    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken);
};

const refreshAccessToken = async (refreshToken: string) => {
    try {
        const response = await axios({
            method: "POST",
            url: `${BACKEND_URL}/api/auth/token`,
            headers: {
                "Content-Type": "application/json",
            },
            data: {
                token: refreshToken,
            },
        });

        const data = response.data;
        if (data.accessToken) {
            await SecureStore.setItemAsync("accessToken", data.accessToken);
            return data.accessToken;
        }
    } catch (error) {
        if ((error as AxiosError).response!.status === 403) {
            console.log("HEREE");
            return <Redirect href="/signIn" />;
        }
        console.log("Refresh Access Token Error: ", error);
    }
    return null;
};

export default AuthProvider;
export { useAuth };
