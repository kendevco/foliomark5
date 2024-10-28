// path: src/components/Spaces/Space/space-header.tsx
"use client";

import { Space } from '@/payload-types';
import { MemberRole } from '@/spaces/collections/types';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from "lucide-react";
import { useModal } from "@/spaces/hooks/use-modal-store";
import { ModalData } from '@/spaces/collections/types'; // Update import path
import { transformSpace } from '@/spaces/collections/types';

interface SpaceHeaderProps {
  space: Space;
  role?: MemberRole;
}

export const SpaceHeader = ({
  space,
  role
}: SpaceHeaderProps) => {
  const { onOpen } = useModal();

  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  // Transform the space object to match the expected type
  const transformedSpace = {
    ...space,
    description: space.description || undefined, // Convert null to undefined
    icon: space.icon && typeof space.icon !== 'string' ? {
      id: space.icon.id,
      url: space.icon.url
    } : undefined,
    owner: {
      id: typeof space.owner === 'string' ? space.owner : space.owner.id,
      relationTo: "users"
    },
    createdBy: {
      id: typeof space.createdBy === 'string' ? space.createdBy : space.createdBy.id,
      relationTo: "users"
    }
  };

  const modalData: ModalData = {
    space: transformSpace(space)
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="focus:outline-none"
        asChild
      >
        <button
          className="w-full text-md font-semibold px-3 flex
                    items-center h-12 border-neutral-200
                    dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10
                    dark:hover:bg-zinc-700/50 transition"
        >
          {space.name}
          <ChevronDown className="h-5 w-5 ml-auto" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 text-xs font-medium text-black
                dark:text-neutral-400 space-y-[2px]"
      >
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen("invite", modalData)}
            className="text-indigo-600 dark:text-indigo-400
                        px-3 py-2 text-sm cursor-pointer"
          >
            Invite People
            <UserPlus className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("editSpace", modalData)}
            className="px-3 py-2 text-sm cursor-pointer"
          >
            Space Settings
            <Settings className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("members", modalData)}
            className="px-3 py-2 text-sm cursor-pointer"
          >
            Manage Members
            <Users className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen("createChannel", modalData)}
            className="px-3 py-2 text-sm cursor-pointer"
          >
            Create Channel
            <PlusCircle className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {isModerator && <DropdownMenuSeparator />}

        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("deleteSpace", modalData)}
            className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
          >
            Delete Space
            <Trash className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {!isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("leaveSpace", modalData)}
            className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
          >
            Leave Space
            <LogOut className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
