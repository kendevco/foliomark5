'use client';

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useModal } from "@/spaces/hooks/use-modal-store";
import { track } from '@vercel/analytics';
import { toast } from "react-hot-toast";
import { getPayloadHMR } from '@payloadcms/next/utilities';
import configPromise from '@payload-config';
import { MediaCategories } from '@/spaces/collections/types';  // Updated import path
import { Space, Media } from '@/payload-types';
import { ModalData as GlobalModalData } from '@/spaces/collections/types';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUpload } from "../../../spaces/components/file-upload";
import { useEffect } from "react";

// Update the modal data type to match our global Space type
interface ModalData {
  space: Space;  // Use the Space type from our types file
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Space name is required."
  }),
  imageUrl: z.string().min(1, {
    message: "Space image is required."
  })
});

export const EditSpaceModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "editSpace";
  const { space } = data as unknown as ModalData;  // Use type assertion with our local ModalData

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: ""
    }
  });

  useEffect(() => {
    if (space) {
      form.setValue("name", space.name);
      // Handle the icon value based on its type
      if (typeof space.icon === 'string') {
        form.setValue("imageUrl", space.icon);
      } else if (space.icon && 'url' in space.icon) {
        form.setValue("imageUrl", space.icon.url || "");
      }
    }
  }, [space, form]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const payload = await getPayloadHMR({ config: configPromise });

      await payload.update({
        collection: 'spaces',
        id: space.id,
        data: {
          name: values.name,
          icon: values.imageUrl, // This should be the media ID
        }
      });

      form.reset();
      router.refresh();
      onClose();
      toast.success('Space updated successfully!');
    } catch (error) {
      console.error('Error updating space:', error);
      toast.error('Failed to update space');
    }
  }

  const handleClose = () => {
    track('Edit Space Modal Closed');
    form.reset();
    onClose();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden mx-4">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Customize your space
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your space a personality with a name and an image.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mx-4">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint={MediaCategories.SPACE}  // Use SPACE instead of SPACE_IMAGE
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                    Space Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading}
                      className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                      placeholder="Enter a space name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button disabled={isLoading} variant="primary">
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
