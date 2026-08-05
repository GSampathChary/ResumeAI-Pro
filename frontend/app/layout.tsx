import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

import { AppShell } from "@/src/components/app-shell";
import { ResumeWorkspaceProvider } from "@/src/lib/workspace";

export const metadata: Metadata = {
  title: "ResumeAI Pro",
  description: "AI-powered resume analysis, ATS optimization, interview prep, and career tools.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ResumeWorkspaceProvider>
          <AppShell>{children}</AppShell>
        </ResumeWorkspaceProvider>
      </body>
    </html>
  );
}
