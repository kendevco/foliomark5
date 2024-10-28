"use client";

import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  Search,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Space, Member, Profile } from "@/payload-types"; // Use Payload types
import { useModal } from "@/spaces/hooks/use-modal-store";
import { useDebounce } from "@/spaces/hooks/use-debounce";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { getPayloadClient } from "@/spaces/utilities/payload/getPayloadClient";
import { searchMembers, addMember, updateMemberRole, removeMember } from "@/spaces/actions/members";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/spaces/components/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

// Define the search result type
interface SearchResult {
  id: string;
  name: string;
  email: string;
  imageUrl?: string;
}

// Define the extended types
interface MemberWithProfile extends Member {
  profile: Profile;
}

interface SpaceWithMembers extends Omit<Space, 'members'> {
  members: MemberWithProfile[];
}

import { ModalType } from "@/spaces/collections/types";
import { MemberRole } from "@/spaces/collections/types";

// Create a const object for role icons
const roleIconMap: Record<MemberRole, React.ReactNode> = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 text-rose-500" />,
  [MemberRole.MEMBER]: null
};

export const MembersModal = () => {
  const router = useRouter();
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const [loadingId, setLoadingId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 500);

  const isModalOpen = isOpen && type === ModalType.MEMBERS;
  const { space } = data as unknown as {
    space: SpaceWithMembers & {
      members: MemberWithProfile[]
    }
  };

  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedSearch || !space?.id) return;
      setIsSearching(true);
      try {
        const results = await searchMembers(debouncedSearch, space.id);
        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    };

    performSearch();
  }, [debouncedSearch, space?.id]);

  const onAddMember = async (userId: string) => {
    try {
      setLoadingId(userId);
      await addMember(userId, space.id);
      router.refresh();
    } catch (error) {
      console.error('Failed to add member:', error);
    } finally {
      setLoadingId("");
    }
  };

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);
      await updateMemberRole(memberId, role);
      router.refresh();
    } catch (error) {
      console.error('Failed to update role:', error);
    } finally {
      setLoadingId("");
    }
  };

  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      await removeMember(memberId);
      router.refresh();
    } catch (error) {
      console.error('Failed to remove member:', error);
    } finally {
      setLoadingId("");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {space?.members?.length} Members
          </DialogDescription>
        </DialogHeader>
        <div className="p-6">
          <Command className="rounded-lg border shadow-md">
            <CommandInput
              placeholder="Search members..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandEmpty>
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin mx-auto" />
              ) : (
                "No members found."
              )}
            </CommandEmpty>
            <CommandGroup heading="Search Results">
              {searchResults.map((result) => (
                <CommandItem
                  key={result.id}
                  className="flex items-center gap-x-2 p-2 hover:bg-zinc-100"
                >
                  <UserAvatar src={result.imageUrl} />
                  <div className="flex flex-col flex-1">
                    <span className="text-sm font-semibold">{result.name}</span>
                    <span className="text-xs text-zinc-500">{result.email}</span>
                  </div>
                  <Button
                    disabled={loadingId === result.id}
                    onClick={() => onAddMember(result.id)}
                    size="sm"
                    variant="ghost"
                  >
                    {loadingId === result.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Add"
                    )}
                  </Button>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </div>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {space?.members?.map((member) => (
            <div key={member.id} className="flex items-center gap-x-2 mb-6">
              <UserAvatar src={member.profile?.imageUrl} />
              <div className="flex flex-col gap-y-1">
                <div className="text-xs font-semibold flex items-center gap-x-1">
                  {member.profile.name}
                  {roleIconMap[member.role as keyof typeof MemberRole]}
                </div>
                <p className="text-xs text-zinc-500">{member.profile.email}</p>
              </div>
              {member.id !== space.owner && loadingId !== member.id && (
                <div className="ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className="h-4 w-4 text-zinc-500" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="left">
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="flex items-center">
                          <ShieldQuestion className="w-4 h-4 mr-2" />
                          <span>Role</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem
                              onClick={() => onRoleChange(member.id, MemberRole.GUEST)}
                            >
                              <Shield className="h-4 w-4 mr-2" />
                              Guest
                              {member.role === MemberRole.GUEST && (
                                <Check className="h-4 w-4 ml-auto" />
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onRoleChange(member.id, MemberRole.MODERATOR)}
                            >
                              <ShieldCheck className="h-4 w-4 mr-2" />
                              Moderator
                              {member.role === MemberRole.MODERATOR && (
                                <Check className="h-4 w-4 ml-auto" />
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onKick(member.id)}>
                        <Gavel className="h-4 w-4 mr-2" />
                        Kick
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              {loadingId === member.id && (
                <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
