"use client";

import { Menu } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { NavigationSidebar } from "@/spaces/components/navigation/navigation-sidebar"
import { SpaceSidebar } from "@/spaces/Space/space-sidebar" // Fix casing

interface MobileToggleProps {
    spaceId: string;
}

export const MobileToggle = ({ spaceId }: MobileToggleProps) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 flex gap-0">
                <div className="w-[72px]">
                    <NavigationSidebar />
                </div>
                <SpaceSidebar spaceId={spaceId} />
            </SheetContent>
        </Sheet>
    );
};
