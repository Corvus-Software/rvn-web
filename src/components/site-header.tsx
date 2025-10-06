"use client"
import { Button } from "@/registry/new-york-v4/ui/button";
import { Separator } from "@/registry/new-york-v4/ui/separator";
import { SidebarTrigger } from "@/registry/new-york-v4/ui/sidebar";
import { RefreshButton } from "./RefreshBtn";
import { useSessions } from "@/hooks/useSessions";

interface Props {
  siteHeader: string;
  onRefresh?: () => void;
}

export function SiteHeader({ siteHeader, onRefresh }: Props) {
  const { sessions, refresh } = useSessions();
  
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center justify-between gap-1 px-4 lg:gap-2 lg:px-6">
        <div className="flex flex-row items-center justify-center">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">{siteHeader}</h1>
        </div>
        <RefreshButton onRefresh={onRefresh ?? (() => {})} />
      </div>
    </header>
  );
}
