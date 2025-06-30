"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { KeyRound, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  apiKey: z.string().min(1, { message: "API Key is required." }),
});

export type ApiKeyFormValues = z.infer<typeof formSchema>;

type ApiKeySetupFormProps = {
  onSubmit: (apiKey: string) => void;
  isLoading?: boolean;
};

export default function ApiKeySetupForm({ onSubmit, isLoading }: ApiKeySetupFormProps) {
  const form = useForm<ApiKeyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((val) => onSubmit(val.apiKey))} className="space-y-6">
        <FormField
          control={form.control}
          name="apiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API Key</FormLabel>
              <FormControl>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    // type="password"
                    placeholder="recall_live_"
                    className="pl-10 w-full"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Set Key
        </Button>
      </form>
    </Form>
  );
}