import { useSession } from "next-auth/react";
import Head from "next/head";
import SidePanel, { ListedPage } from "../SidePanel";
import { api } from "~/utils/api";
import MovieCard from "~/components/MovieCard";

export default function WatchedMoviesPage() {
  useSession({ required: true })

  return <>
    <Head>
      <title>Movie night</title>
      <meta name="description" content="Let's do movie night" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main className="flex min-h-screen w-screen text-foreground flex-col items-center justify-center bg-background">
      <div className="flex flex-row justify-center items-center">
        <div>
          <SidePanel currentPage={ListedPage.WATCHED_MOVIE} />
        </div>
        <div className="w-full flex flex-col items-center justify-center gap-12 px-4 py-16">
          <div className="w-full flex flex-wrap gap-4 items-center justify-center lg:justify-start">
            <MovieList />
          </div>
        </div>
      </div>
    </main>
  </>
}

function MovieList() {
  const movieQuery = api.movie.getWatched.useQuery();

  if (movieQuery.status !== "success") {
    return <span>Loading...</span>
  }

  return <>
    {movieQuery.data?.map((movie) => {
      return <MovieCard movie={movie} key={movie.id} />
    })}
  </>
}
