import Head from "next/head";
import Home from "./Home";
import Login from "./Login";
import { useSession } from "next-auth/react";

export default function Index() {
  return (
    <>
      <Head>
        <title>Movie night</title>
        <meta name="description" content="Let's do movie night" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen w-screen text-foreground flex-col items-center justify-center bg-background">
        <Body />
      </main>
    </>
  );
}

function Body() {
  const { status } = useSession()

  if (status !== 'authenticated') return <Login />

  return <Home />
}
