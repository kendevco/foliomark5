import { redirect } from "next/navigation"
import { getCurrentUser } from "@/spaces/utilities/getCurrentUser"
import { NavigationAction } from "./navigation-action"
import { NavigationItem } from "./navigation-item"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ModeToggle } from "@/components/mode-toggle"

export const NavigationSidebar = async () => {
  const user = await getCurrentUser()

  if (!user) {
    return redirect("/sign-in")
  }

  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3">
      <NavigationAction />
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      <ScrollArea className="flex-1 w-full">
        <NavigationItem />
      </ScrollArea>
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        <ModeToggle />
      </div>
    </div>
  )
}
