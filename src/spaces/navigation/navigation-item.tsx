// path: src/components/Spaces/navigation/navigation-item.tsx
"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/spaces/lib/utils";
import { ActionTooltip } from "@/spaces/components/action-tooltip";
import { Space } from "@/spaces/types/spaces";

interface NavigationItemProps {
    space: Space;
    onlineCount?: number;
}

export const NavigationItem = ({
    space,
    onlineCount = 0
}: NavigationItemProps) => {
    const params = useParams();
    const router = useRouter();

    const onClick = () => {
        router.push(`/spaces/${space.id}`);
    }

    return (
        <ActionTooltip
            side="right"
            align="center"
            label={`${space.name} ${onlineCount > 0 ? `- ${onlineCount} online` : ''}`}
        >
            <button
                onClick={onClick}
                className="group relative flex items-center"
            >
                <div className={cn(
                    "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
                    params?.spaceId !== space.id && "group-hover:h-[20px]",
                    params?.spaceId === space.id ? "h-[36px]" : "h-[8px]"
                )} />

                <div className={cn(
                    "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
                    params?.spaceId === space.id && "bg-primary/10 text-primary rounded-[16px]"
                )} >
                    <Image
                        fill
                        src={space.imageUrl}
                        alt="Space"
                        sizes="48px"
                    />
                    {onlineCount > 0 && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-[10px] text-white font-semibold">
                                {onlineCount}
                            </span>
                        </div>
                    )}
                </div>
            </button>
        </ActionTooltip>
    )
}
