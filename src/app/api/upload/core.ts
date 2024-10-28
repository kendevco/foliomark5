import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

const f = createUploadthing();

const auth = async () => {
  const payload = await getPayloadHMR({ config: configPromise });
  // Use the proper auth method from Payload
  try {
    const result = await payload.find({
      collection: 'users',
      limit: 1,
      // Add your auth conditions here
    });

    if (!result.docs[0]) throw new Error("Unauthorized");
    return { userId: result.docs[0].id };
  } catch (err) {
    throw new Error("Unauthorized");
  }
}

export const ourFileRouter = {
  spaceImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => await auth())
    .onUploadComplete(async ({ metadata, file }) => {
      const payload = await getPayloadHMR({ config: configPromise });
      return { url: file.url };
    }),
  messageFile: f(["image", "pdf"])
    .middleware(async () => await auth())
    .onUploadComplete(async ({ metadata, file }) => {
      const payload = await getPayloadHMR({ config: configPromise });
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
