import { type AppType } from "next/app";
import { Geist } from "next/font/google";
import { SessionProvider } from 'next-auth/react';

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ThemeProvider } from "~/components/theme-provider";
import { SidebarProvider } from "~/components/ui/sidebar";

const geist = Geist({
  subsets: ["latin"],
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any */}
      <SessionProvider session={(pageProps as unknown as any).session}>
        <SidebarProvider>
          <div className={geist.className}>
            <Component {...pageProps} />
          </div>
        </SidebarProvider>
      </SessionProvider>
    </ThemeProvider>
  );
};

export default api.withTRPC(MyApp);
