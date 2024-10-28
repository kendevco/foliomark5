// path: src/spaces/components/navigation/navigation-item.tsx
"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/utilities/cn";
import { ActionTooltip } from "@/spaces/components/action-tooltip";

interface NavigationItemProps {
  id: string;
  imageUrl: string;
  name: string;
}

export const NavigationItem = ({
  id,
  imageUrl,
  name
}: NavigationItemProps) => {
  const params = useParams();
  const router = useRouter();

  const onClick = () => {
    router.push(`/spaces/${id}`);
  }

  return (
    <ActionTooltip
      side="right"
      align="center"
      label={name}
    >
      <button
        onClick={onClick}
        className="group relative flex items-center"
      >
        <div className={cn(
          "absolute left-0 bg-primary w-[4px] rounded-r-full transition-all",
          params?.spaceId !== id && "group-hover:h-[20px]",
          params?.spaceId === id ? "h-[36px]" : "h-[8px]"
        )} />

        <div className={cn(
          "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
          params?.spaceId === id && "bg-primary/10 rounded-[16px]"
        )}>
          <Image
            fill
            src={imageUrl}
            alt="Space"
          />
        </div>
      </button>
    </ActionTooltip>
  )
}
