"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useState, useRef } from "react";
import { track } from "@vercel/analytics";
import toast from "react-hot-toast";
import { MediaCategory } from "@/spaces/collections/types";
import { useAuth } from "@/spaces/hooks/use-auth";

interface FileUploadProps {
  endpoint: MediaCategory;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  maxSize?: number;
}

interface UploadResponse {
  url: string;
}

export const FileUpload = ({
  onChange,
  value,
  endpoint,
  accept = "image/*",
  maxSize = 4 * 1024 * 1024, // 4MB
}: FileUploadProps) => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (maxSize && file.size > maxSize) {
      toast.error(`File size must be less than ${maxSize / 1024 / 1024}MB`);
      return;
    }

    setIsUploading(true);

    try {
      // Create FormData and append necessary info
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', endpoint);

      // Make the upload request
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data: UploadResponse = await response.json();

      if (data.url) {
        onChange(data.url);
        track('File Uploaded', {
          fileName: file.name,
          fileType: file.type,
          category: endpoint
        });
        toast.success("File uploaded successfully!");
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4 w-full flex flex-col items-center justify-center">
      <input
        type="file"
        accept={accept}
        onChange={handleUpload}
        ref={fileRef}
        className="hidden"
      />

      {value ? (
        <div className="relative h-20 w-20">
          <Image
            fill
            src={value}
            alt="Upload"
            className="rounded-full"
          />
          <button
            onClick={() => onChange("")}
            className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileRef.current?.click()}
          className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      )}
    </div>
  );
};
