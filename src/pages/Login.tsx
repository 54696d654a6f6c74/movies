import { Form, FormControl, FormField, FormItem, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { zodResolver } from '@hookform/resolvers/zod'
import z from "zod";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { signIn } from "next-auth/react";

const FormSchema = z.object({
  username: z.string().min(3,
    {
      message: "Nice try... try a real username?",
    }),
})

export default function Login() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: ""
    }
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    return signIn('credentials', { username: data.username })
  }

  return <Form {...form}>
    <form onSubmit={e => {
      e.preventDefault();
      return form.handleSubmit(onSubmit)(e);
    }} className="flex flex-row gap-1">
      <FormField control={form.control} name="username" render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input placeholder="Your username please..." {...field} />
          </FormControl>
          <FormMessage className="duration-200 animate-bounce ease-out" />
        </FormItem>
      )}>
      </FormField>
      <Button type="submit" className="hover:animate-pulse">Submit</Button>
    </form>
  </Form >
}
