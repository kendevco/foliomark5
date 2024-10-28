'use client';

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { MediaCategories } from '@/collections/Spaces/Media';
import { useUser } from "@/spaces/hooks/use-user";
import { useEffect, useState } from "react";
import { Profile } from "@/payload-types";
import { getPayloadClient } from "@/spaces/utilities/payload/getPayloadClient";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUpload } from "../components/file-upload";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required."
  }),
  imageUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const ProfileSettings = () => {
  const { user } = useUser();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      try {
        const payload = await getPayloadClient();
        const { docs } = await payload.find({
          collection: 'profiles',
          where: {
            user: {
              equals: user.id
            }
          }
        });

        setProfile(docs[0] || null);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [user?.id]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      imageUrl: profile?.imageUrl || "",
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: FormValues) => {
    try {
      const payload = await getPayloadClient();

      // Add check for null user.id
      if (!user?.id) return;
      // Update user
      await payload.update({
        collection: 'users',
        id: user.id,
        data: {
          name: values.name,
        },
      });

      // Update or create profile
      if (profile?.id) {
        await payload.update({
          collection: 'profiles',
          id: profile.id,
          data: {
            imageUrl: values.imageUrl,
          },
        });
      } else {
        await payload.create({
          collection: 'profiles',
          data: {
            user: user.id,
            imageUrl: values.imageUrl,
          },
        });
      }

      router.refresh();
      toast.success('Profile updated!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>
          Update your profile information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8">
              <div className="flex items-center justify-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint={MediaCategories.PROFILE}
                          value={field.value || ""}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter your name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isLoading}
                variant="default"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
