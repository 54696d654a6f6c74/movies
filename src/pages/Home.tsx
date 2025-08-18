/* eslint-disable @next/next/no-img-element */

import z from "zod";
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";

import { api } from "~/utils/api";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { useEffect, useState } from "react";
import SidePanel, { ListedPage } from "./SidePanel";
import { useSession } from "next-auth/react";
import { Loader2Icon } from "lucide-react";

const FormSchema = z.object({
  imdbLink: z.string().regex(
    /imdb\.com\/(title\/tt\d{7,8})\?*/,
    {
      message: "Nice try... Use a real link.",
    }),
})

export default function Home() {
  const [imdbId, setImdbId] = useState<string | undefined>()
  const user = useSession({ required: true });

  const movieQuery = api.movie.find.useQuery({ id: imdbId! }, { enabled: Boolean(imdbId) })
  const addMovie = api.movie.add.useMutation();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      imdbLink: ""
    }
  })

  useEffect(() => {
    if (!movieQuery.isSuccess || !movieQuery.data || !user.data || movieQuery.data.sugguested) return;

    addMovie.mutate({
      id: movieQuery.data.id,
      suggested_by_username: user.data.user.id,
      suggestion_timestamp: Date.now(),
      votes: 0,
      title: movieQuery.data.title,
      image_url: movieQuery.data.imageUrl
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieQuery.data,])

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const imdbId = new URL(data.imdbLink).pathname.split('/').filter(Boolean).pop()
    if (!imdbId) return;
    setImdbId(imdbId);
  }

  return (
    <div className="flex flex-row justify-center items-center w-screen">
      <div >
        <SidePanel currentPage={ListedPage.SUGGEST_MOVIE} />
      </div>
      <div className="w-full flex flex-col items-center justify-center gap-12 px-4 py-16">
        <Form {...form}>
          <form onSubmit={e => {
            e.preventDefault();
            return form.handleSubmit(onSubmit)(e);
          }} className="flex flex-row gap-1">
            <FormField control={form.control} name="imdbLink" render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Enter IMDb link..." {...field} />
                </FormControl>
                <FormMessage className="duration-200 animate-bounce ease-out" />
              </FormItem>
            )}>
            </FormField>
            <Button type="submit" className="flex gap-1">
              {(movieQuery.isFetching || addMovie.isPending) && (
                <Loader2Icon className="animate-spin" />
              )}
              <span>
                Suggest
              </span>
            </Button>
          </form>
        </Form>
        {movieQuery.data && (
          <div className="flex flex-col gap-4 items-center justify-center">
            <span className="text-xl">{movieQuery.data.sugguested ? "Movie already suggested" : "Suggestion added"}</span>
            <img src={movieQuery.data.imageUrl} alt={movieQuery.data.title} />
          </div>
        )}

      </div>
    </div>
  );
}

