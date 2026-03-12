"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/user-auth";
import { Loader2, AlertCircle } from "lucide-react";
import { useConvexAuth } from "convex/react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const { signInForm, handleSignIn, isLoading } = useAuth();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = signInForm;

  useEffect(() => {
    console.log("🔐 SignIn page - Auth state changed:", { 
      isAuthenticated, 
      authLoading,
      pageLoading: isLoading,
      timestamp: new Date().toISOString()
    });

    // Redirect authenticated users to dashboard
    if (isAuthenticated && !authLoading) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, authLoading, isLoading, router]);

  return (
    <Card className="bg-card text-card-foreground ring-1 ring-foreground/10">
      <CardHeader className="space-y-1 pb-6 text-center sm:text-left">
        <CardTitle className="text-2xl text-foreground">Welcome Back</CardTitle>
        <CardDescription className="text-muted-foreground">
          Sign in to your S2C account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <form onSubmit={handleSubmit(handleSignIn)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="you@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-xs text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/auth/reset-password"
                className="text-xs text-primary hover:text-primary/80 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              disabled={isLoading}
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="text-xs text-red-400">{errors.password.message}</p>
            )}
          </div>

          {/* Error handling now via toast in useAuth hook */}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 text-base"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              New user?
            </span>
          </div>
        </div>

        <Link href="/auth/sign-up">
          <Button
            variant="outline"
            className="w-full h-11"
          >
            Create Account
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
