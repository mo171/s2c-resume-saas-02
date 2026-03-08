"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/user-auth";
import {
  Loader2,
  Mail,
  MessageCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { useConvexAuth } from "convex/react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function SignupPage() {
  const { signUpForm, handleSignUp, isLoading } = useAuth();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = signUpForm;

  useEffect(() => {
    console.log("📝 SignUp page - Auth state changed:", { 
      isAuthenticated, 
      authLoading,
      pageLoading: isLoading,
      timestamp: new Date().toISOString()
    });
  }, [isAuthenticated, authLoading, isLoading]);

  return (
    <Card className="border-[#1E1E2D] bg-[#0A0A12] shadow-2xl backdrop-blur-sm">
      <CardHeader className="space-y-1 pb-6 text-center sm:text-left">
        <CardTitle className="text-2xl text-white">Create Account</CardTitle>
        <CardDescription className="text-[#9496A1]">
         S2C Account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {/* Toggle / Tabs */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-center gap-2 rounded-xl border border-[#2D2D3A] bg-[#0E0E16] py-2.5 text-sm font-medium text-gray-500 cursor-not-allowed opacity-50">
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </div>

          <div className="flex items-center justify-center gap-2 rounded-xl bg-[#7047EB]/10 border border-[#7047EB]/50 py-2.5 text-sm font-medium text-[#A888FF]">
            <Mail className="h-4 w-4" />
            Email
          </div>
        </div>

        <form onSubmit={handleSubmit(handleSignUp)} className="grid gap-4">
          {/* First Name */}
          <div className="grid gap-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              placeholder="John"
              type="text"
              disabled={isLoading}
              {...register("firstName", {
                required: "First name is required",
              })}
            />
            {errors.firstName && (
              <p className="text-xs text-red-400">{errors.firstName.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="grid gap-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              placeholder="Doe"
              type="text"
              disabled={isLoading}
              {...register("lastName", {
                required: "Last name is required",
              })}
            />
            {errors.lastName && (
              <p className="text-xs text-red-400">{errors.lastName.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="grid gap-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="you@example.com"
              type="email"
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

          {/* Password */}
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              disabled={isLoading}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
            />
            {errors.password ? (
              <p className="text-xs text-red-400">{errors.password.message}</p>
            ) : (
              <p className="text-[10px] text-gray-500">At least 8 characters</p>
            )}
          </div>

          {/* Remove confirm password - handled by Zod schema in hook */}
          {/* Remove terms checkbox - can add back if needed */}
          {/* Error handling now via toast in useAuth hook */}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 text-base shadow-[0_0_20px_rgba(112,71,235,0.2)]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[#2D2D3A]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#0A0A12] px-2 text-muted-foreground">
              Already have an account?
            </span>
          </div>
        </div>

        <Link href="/auth/sign-in">
          <Button
            variant="secondary"
            className="w-full h-11 border-[#2D2D3A] bg-transparent hover:bg-[#1A1A24]"
          >
            Sign In
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
