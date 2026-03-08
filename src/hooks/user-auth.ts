import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

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
        try {
            await signIn("password", {
                email: data.email,
                password: data.password,
                flow: "signIn",
            });
            router.push("/dashboard");
        } catch (error) {
            toast.error((error as Error).message || "Failed to sign in");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignUp = async (data: SignUpData) => {
        setIsLoading(true);
        try {
            await signIn("password", {
                email: data.email,
                password: data.password,
                name: `${data.firstName} ${data.lastName}`,
                flow: "signUp",
            });
            router.push("/dashboard");
        } catch (error) {
            toast.error((error as Error).message || "Failed to sign up");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            router.push("/auth/sign-in");
        } catch (error) {
            toast.error((error as Error).message || "Failed to sign out");
        } 
    };


    return { signInForm, signUpForm, handleSignIn, isLoading, handleSignUp, handleSignOut };
}