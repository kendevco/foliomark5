// path: src/spaces/components/Space/space-section.tsx
"use client";

import { ServerCrash, Plus } from "lucide-react";
import { ActionTooltip } from "@/spaces/components/action-tooltip";
import { useModal } from "@/spaces/hooks/use-modal-store";
import {
  ChannelType,
  MemberRole,
  ModalType,
  transformSpace
} from '@/spaces/collections/types';
import { Space } from "@/payload-types";

interface SpaceSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: "channels" | "members";
  channelType?: ChannelType;
  space?: Space;
}

export const SpaceSection = ({
  label,
  role,
  sectionType,
  channelType,
  space
}: SpaceSectionProps) => {
  const { onOpen } = useModal();

  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {role !== MemberRole.GUEST && sectionType === "channels" && (
        <ActionTooltip label="Create Channel" side="top">
          <button
            onClick={() => onOpen(ModalType.CREATE_CHANNEL, {
              space: space ? transformSpace(space) : undefined
            })}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
          >
            <Plus className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
      {role === MemberRole.ADMIN && sectionType === "members" && (
        <ActionTooltip label="Manage Members" side="top">
          <button
            onClick={() => onOpen(ModalType.MEMBERS, {
              space: space ? transformSpace(space) : undefined
            })}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
          >
            <ServerCrash className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};
