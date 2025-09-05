/* eslint-disable @next/next/no-img-element */
import { useSession } from "next-auth/react";
import { useState } from "react";
import type { Movie } from "~/models/movie";
import { api } from "~/utils/api";
import { Button } from "./ui/button";
import { ChevronsDownIcon, ChevronsUpIcon, Loader2Icon } from "lucide-react";

type Props = {
  movie: Movie
}

export default function MovieCard({ movie }: Props) {
  return <div className="flex flex-col gap-2">
    <div className="h-full w-full flex items-center justify-center">
      <a href={`https://www.imdb.com/title/${movie.id}`} target="_blank">
        <img src={movie.image_url} alt={movie.title} />
      </a>
    </div>

    <span className="w-full text-center text-2xl font-bold">{movie.title}</span>

  </div>
}

export function MovieCardVoteable({ movie }: Props) {
  const [loading, setLoading] = useState(false);

  const voteQuery = api.vote.getAllForMovie.useQuery({ movieId: movie.id });
  const addVote = api.vote.addVote.useMutation();
  const removeVote = api.vote.removeVote.useMutation();

  const session = useSession({
    required: true
  });
  const userId = session.data?.user?.id;

  const votes = voteQuery.data?.length;

  const isVoted = voteQuery.data?.find(({ username }) => username === userId);

  async function onLikeClick() {
    if (!userId || loading) return;
    setLoading(true);

    try {
      if (isVoted) {
        await removeVote.mutateAsync({ userId, movieId: movie.id })
      } else {
        await addVote.mutateAsync({ movieId: movie.id, userId })
      }

      await voteQuery.refetch()
    } finally {
      setLoading(false);
    }
  }

  return <div className="flex flex-col gap-2">
    <MovieCard movie={movie} />

    <div className="flex justify-around items-center">
      <span >
        <strong>Votes:</strong> {votes}
      </span>
      <Button className="flex gap-1" variant={isVoted ? 'destructive' : 'default'} disabled={loading} onClick={onLikeClick}>
        {loading && <Loader2Icon className="animate-spin" />}
        {!isVoted && <ChevronsUpIcon />}
        {isVoted && <ChevronsDownIcon />}
        <span className="w-full">
          {isVoted ? "Unvote" : "Vote"}
        </span>
      </Button>
    </div>
  </div>
}
