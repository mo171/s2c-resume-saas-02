import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useConvexAuth } from "convex/react";

type SignInData = z.infer<typeof signInSchema>;
type SignUpData = z.infer<typeof signUpSchema>;

const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

const signUpSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
});


export const useAuth  = () => {
    const { signIn, signOut } = useAuthActions();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    
    const signInForm = useForm<SignInData>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const signUpForm = useForm<SignUpData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        },
    });

    const handleSignIn = async (data: SignInData) => {
        setIsLoading(true);
        console.log("🔑 Starting sign in with:", { email: data.email, passwordLength: data.password.length });
        
        try {
            const result = await signIn("password", {
                email: data.email,
                password: data.password,
                flow: "signIn",
            });
            
            console.log("✅ Sign in result:", result);
            
            if (result && result.signingIn) {
                console.log("🎯 Sign in successful, waiting for session...");
                // Give Convex time to establish the session
                setTimeout(() => {
                    console.log("🚀 Redirecting to dashboard...");
                    router.push("/dashboard");
                }, 1000);
            } else {
                console.log("⚠️ Sign in completed but signingIn is false:", result);
                toast.error("Sign in completed but session not established");
            }
        } catch (error) {
            console.error("❌ Sign in error:", error);
            console.error("Error details:", {
                message: error.message,
                stack: error.stack,
                name: error.name,
                cause: error.cause
            });
            toast.error((error as Error).message || "Failed to sign in");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignUp = async (data: SignUpData) => {
        setIsLoading(true);
        console.log("📝 Starting sign up with:", { 
            email: data.email, 
            firstName: data.firstName, 
            lastName: data.lastName,
            passwordLength: data.password.length 
        });
        
        try {
            const result = await signIn("password", {
                email: data.email,
                password: data.password,
                name: `${data.firstName} ${data.lastName}`,
                flow: "signUp",
            });
            
            console.log("✅ Sign up result:", result);
            
            if (result && result.signingIn) {
                console.log("🎯 Sign up successful, waiting for session...");
                setTimeout(() => {
                    console.log("🚀 Redirecting to dashboard...");
                    router.push("/dashboard");
                }, 1000);
            } else {
                console.log("⚠️ Sign up completed but signingIn is false:", result);
                toast.error("Account created but session not established");
            }
        } catch (error) {
            console.error("❌ Sign up error:", error);
            console.error("Error details:", {
                message: error.message,
                stack: error.stack,
                name: error.name,
                cause: error.cause
            });
            toast.error((error as Error).message || "Failed to sign up");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignOut = async () => {
        console.log("🚪 Starting sign out...");
        try {
            await signOut();
            console.log("✅ Sign out successful, clearing browser storage...");
            
            // Clear all browser storage to ensure clean state
            if (typeof window !== 'undefined') {
                localStorage.clear();
                sessionStorage.clear();
                // Clear cookies by setting them to expire
                document.cookie.split(";").forEach((c) => {
                    const eqPos = c.indexOf("=");
                    const name = eqPos > -1 ? c.substr(0, eqPos) : c;
                    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
                });
            }
            
            router.push("/auth/sign-in");
        } catch (error) {
            console.error("❌ Sign out error:", error);
            toast.error((error as Error).message || "Failed to sign out");
        } 
    };

    // Debug helper function
    const clearAuthState = () => {
        if (typeof window !== 'undefined') {
            console.log("🧹 Clearing all auth state...");
            localStorage.clear();
            sessionStorage.clear();
            document.cookie.split(";").forEach((c) => {
                const eqPos = c.indexOf("=");
                const name = eqPos > -1 ? c.substr(0, eqPos) : c;
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
            });
            window.location.reload();
        }
    };


    return { signInForm, signUpForm, handleSignIn, isLoading, handleSignUp, handleSignOut, clearAuthState };
}