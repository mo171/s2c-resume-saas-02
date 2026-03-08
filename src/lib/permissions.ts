export const isPublicRoutes = ["/auth(.*)",  "/", "/debug"]

export const isBypassRoutes = [
    "/api/polar/webhook",
    "/api/inngest(.*)",
    "/api/auth(.*)",
    "/convex(.*)"
]

// Temporarily disable protection for debugging auth issues
export const isProtectedRoutes = ["/dashboard(.*)"]
// Uncomment below and comment above to disable protection for testing:
// export const isProtectedRoutes = []