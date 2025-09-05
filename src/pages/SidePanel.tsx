import { ScanEyeIcon, SidebarOpenIcon, Tally5Icon, TicketPlusIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "~/components/ui/sidebar";

export enum ListedPage {
  SUGGEST_MOVIE,
  VOTE_MOVIE,
  WATCHED_MOVIE
}

type Props = {
  currentPage: ListedPage
}

export default function SidePanel({ currentPage }: Props) {
  const sidePanel = useSidebar();

  return (
    <>
      {sidePanel.isMobile && !sidePanel.openMobile && (
        <Button className="fixed top-4 left-4 z-50" size="icon" variant="secondary" onClick={() => sidePanel.setOpenMobile(true)}>
          <SidebarOpenIcon />
        </Button>
      )}
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => sidePanel.setOpenMobile(false)} isActive={currentPage === ListedPage.SUGGEST_MOVIE} disabled={currentPage === ListedPage.SUGGEST_MOVIE}>
                    <Link className="flex gap-2 size-full items-center justify-start" href="/">
                      <TicketPlusIcon size="20px" />
                      <span>Suggest movie</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => sidePanel.setOpenMobile(false)} isActive={currentPage === ListedPage.VOTE_MOVIE} disabled={currentPage === ListedPage.VOTE_MOVIE}>
                    <Link className="flex gap-2 size-full items-center justify-start" href="/votes">
                      <Tally5Icon size="20px" />
                      <span>Vote on movies</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => sidePanel.setOpenMobile(false)} isActive={currentPage === ListedPage.WATCHED_MOVIE} disabled={currentPage === ListedPage.WATCHED_MOVIE}>
                    <Link className="flex gap-2 size-full items-center justify-start" href="/watched">
                      <ScanEyeIcon size="20px" />
                      <span>Watched</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarFooter>

      </Sidebar>
    </>
  );
}
