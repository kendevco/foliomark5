"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/spaces/hooks/use-auth";
import { cn } from "@/utilities/cn";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { User, Profile } from "@/payload-types";
import { useEffect, useState } from 'react';
import { getUserWithProfile } from '@/spaces/utilities';

interface UserButtonProps {
  user: User & {
    profile?: Profile;
  };
  className?: string;
}

export const UserButton = ({ user: initialUser, className }: UserButtonProps) => {
  const [user, setUser] = useState(initialUser);
  const { logout } = useAuth();

  useEffect(() => {
    // Fetch user with profile if we don't have profile data
    if (!user.profile) {
      const fetchUserWithProfile = async () => {
        try {
          const response = await fetch('/api/users/me');
          const userData = await response.json();
          setUser(userData);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      };
      fetchUserWithProfile();
    }
  }, [user.id, user.profile]);

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Get the image URL from the user's profile
  const imageUrl = user.profile?.imageUrl;

  return (
    <div className={cn("h-[48px] w-[48px] rounded-[24px]", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none" asChild>
          <button className="w-full text-sm font-medium transition-colors hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 p-3 rounded-lg">
            <div className="flex items-center gap-x-2">
              <Avatar className={cn("h-8 w-8 md:h-8 md:w-8")}>
                <AvatarImage
                  src={imageUrl || undefined}
                  alt={user.profile?.name || 'User avatar'}
                />
                <AvatarFallback>
                  {user.profile?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-y-1 items-start">
                <p className="text-sm font-medium line-clamp-1">
                  {user.profile?.name || 'User'}
                </p>
              </div>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]"
        >
          <DropdownMenuItem
            onClick={handleSignOut}
            className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
