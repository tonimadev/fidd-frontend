/**
 * Layout para a área do cliente (mobile web)
 */

import { MobileAuthProvider } from "@/context/mobile-auth-context";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MobileAuthProvider>
      <div className="min-h-screen bg-background text-foreground">
        {children}
      </div>
    </MobileAuthProvider>
  );
}
