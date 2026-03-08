"use client";

import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "@/hooks/user-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, User } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  
  useEffect(() => {
    console.log("🎯 Dashboard page loaded - Auth state:", { 
      isAuthenticated, 
      isLoading,
      timestamp: new Date().toISOString()
    });
  }, [isAuthenticated, isLoading]);

  return (
    <>
      <AuthLoading>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AuthLoading>
      
      <Unauthenticated>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>You need to be signed in to access this page.</p>
              <Link href="/auth/sign-in">
                <Button className="w-full">Sign In</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </Unauthenticated>

      <Authenticated>
        <DashboardContent />
      </Authenticated>
    </>
  );
}

function DashboardContent() {
  const user = useQuery(api.users.getCurrentUser);
  const { handleSignOut, clearAuthState } = useAuth();
  const { isAuthenticated } = useConvexAuth();
  const router = useRouter();

  console.log("👤 DashboardContent rendered - User data:", {
    userId: user?._id,
    email: user?.email,
    name: user?.name,
    isAuthenticated,
    timestamp: new Date().toISOString()
  });

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="text-sm text-muted-foreground">
                {user?.email}
              </span>
            </div>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => router.push('/debug')}
            >
              🔍 Debug
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={clearAuthState}
            >
              🧹 Clear
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome to S2C Resume SaaS! 🎉</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your authentication is working perfectly! You can now start building your resume features.
            </p>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">User Information:</h3>
              <pre className="text-sm">{JSON.stringify(user, null, 2)}</pre>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Resume</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Build your professional resume
              </p>
              <Button className="w-full mt-4" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Choose from professional templates
              </p>
              <Button className="w-full mt-4" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My Resumes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage your saved resumes
              </p>
              <Button className="w-full mt-4" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}