// path: src/app/(frontend)/spaces/[spaceId]/layout.tsx
import React from 'react';
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/spaces/utilities/payload/getCurrentUser";
import { SpaceSidebar } from "@/spaces/Space/space-sidebar";
import { MobileToggle } from "@/spaces/components/mobile-toggle";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Space Layout',
  description: 'Layout for Space pages',
};

type Props = {
  children: React.ReactNode;
  params: { spaceId: string }
}

export default async function SpaceLayout({ children, params }: Props) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="h-full">
      <div className="md:hidden">
        <MobileToggle spaceId={params.spaceId} />
      </div>
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <SpaceSidebar spaceId={params.spaceId} />
      </div>
      <main className="h-full md:pl-60">
        {children}
      </main>
    </div>
  );
}
