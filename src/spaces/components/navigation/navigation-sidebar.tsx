// path: src/spaces/components/navigation/navigation-sidebar.tsx

"use client";

import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { NavigationAction } from "./navigation-action";
import { NavigationItem } from "./navigation-item";
import { ModeToggle } from "@/spaces/components/mode-toggle";
import { UserButton } from "@/spaces/components/user-button";
import { useSocket } from "@/spaces/hooks/use-chat-socket";
import { Space } from "@/spaces/types/spaces";
import { useUser } from "@/spaces/hooks/use-user";

export const NavigationSidebar = () => {
    const [spaces, setSpaces] = useState<Space[]>([]);
    const [onlineCounts, setOnlineCounts] = useState<Record<string, number>>({});
    const { socket } = useSocket();
    const { user } = useUser();

    useEffect(() => {
        // Fetch spaces from Payload
        const fetchSpaces = async () => {
            const response = await fetch('/api/spaces');
            const data = await response.json();
            setSpaces(data.docs);
        };

        fetchSpaces();
    }, []);

    useEffect(() => {
        if (!socket) return;

        // Listen for online status updates
        socket.on('presence:update', (data: { spaceId: string; count: number }) => {
            setOnlineCounts(prev => ({
                ...prev,
                [data.spaceId]: data.count
            }));
        });

        return () => {
            socket.off('presence:update');
        };
    }, [socket]);

    if (!user) return null;

    return (
        <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3">
            <NavigationAction />
            <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
            <ScrollArea className="flex-1 w-full">
                {spaces.map((space) => (
                    <div key={space.id} className="mb-4">
                        <NavigationItem
                            id={space.id}
                            name={space.name}
                            imageUrl={space.imageUrl}
                        />
                    </div>
                ))}
            </ScrollArea>
            <div className="flex flex-col items-center pb-3 mt-auto gap-y-4">
                <ModeToggle />
                <UserButton
                    user={user}
                    className="h-[48px] w-[48px] rounded-[24px]"
                />
            </div>
        </div>
    )
}
