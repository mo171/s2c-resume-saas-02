"use client"

import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DebugPage() {
    const { isAuthenticated, isLoading } = useConvexAuth();
    const { signOut } = useAuthActions();
    const [cookies, setCookies] = useState<string>("");
    const [storageInfo, setStorageInfo] = useState<{
        localStorage: Record<string, string>;
        sessionStorage: Record<string, string>;
    }>({
        localStorage: {},
        sessionStorage: {}
    });

    useEffect(() => {
        // Get all cookies
        setCookies(document.cookie);

        // Get all storage
        const localStorage: Record<string, string> = {};
        const sessionStorage: Record<string, string> = {};

        if (typeof window !== 'undefined') {
            for (let i = 0; i < window.localStorage.length; i++) {
                const key = window.localStorage.key(i);
                if (key) {
                    localStorage[key] = window.localStorage.getItem(key) || '';
                }
            }

            for (let i = 0; i < window.sessionStorage.length; i++) {
                const key = window.sessionStorage.key(i);
                if (key) {
                    sessionStorage[key] = window.sessionStorage.getItem(key) || '';
                }
            }
        }

        setStorageInfo({ localStorage, sessionStorage });
    }, [isAuthenticated]);

    const clearAll = () => {
        if (typeof window !== 'undefined') {
            window.localStorage.clear();
            window.sessionStorage.clear();
            document.cookie.split(";").forEach((c) => {
                const eqPos = c.indexOf("=");
                const name = eqPos > -1 ? c.substr(0, eqPos) : c;
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
            });
            window.location.reload();
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold">🔍 Authentication Debug Page</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Auth State</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <p><strong>isLoading:</strong> {isLoading ? "true" : "false"}</p>
                            <p><strong>isAuthenticated:</strong> {isAuthenticated ? "true" : "false"}</p>
                        </div>
                        <div className="mt-4 space-x-2">
                            <Button
                                onClick={() => signOut()}
                                variant="outline"
                                disabled={!isAuthenticated}
                            >
                                Sign Out
                            </Button>
                            <Button
                                onClick={clearAll}
                                variant="destructive"
                            >
                                Clear All Data
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Cookies</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm">
                            {cookies ? (
                                <pre className="whitespace-pre-wrap break-words">
                                    {cookies.split(';').map(cookie => cookie.trim()).join('\n')}
                                </pre>
                            ) : (
                                <p className="text-gray-500">No cookies found</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Storage</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-semibold mb-2">localStorage</h3>
                                {Object.keys(storageInfo.localStorage).length > 0 ? (
                                    <pre className="text-sm bg-gray-100 p-2 rounded">
                                        {JSON.stringify(storageInfo.localStorage, null, 2)}
                                    </pre>
                                ) : (
                                    <p className="text-gray-500">Empty</p>
                                )}
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">sessionStorage</h3>
                                {Object.keys(storageInfo.sessionStorage).length > 0 ? (
                                    <pre className="text-sm bg-gray-100 p-2 rounded">
                                        {JSON.stringify(storageInfo.sessionStorage, null, 2)}
                                    </pre>
                                ) : (
                                    <p className="text-gray-500">Empty</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}