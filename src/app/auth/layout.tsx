import Link from "next/link";
import { MessageSquare } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-background">

      {/* Header / Logo */}
      <div className="mb-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-primary p-2.5 rounded-xl">
            <MessageSquare className="w-6 h-6 text-primary-foreground fill-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            S2C
          </span>
        </Link>
      </div>

      {/* Auth Card Content */}
      <div className="w-full max-w-[440px]">{children}</div>

      {/* Footer Links */}
      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          Built for professionals • Secure • Privacy-first
        </p>
      </div>
    </div>
  );
}
