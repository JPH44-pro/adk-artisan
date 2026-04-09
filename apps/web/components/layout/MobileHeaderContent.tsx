"use client";

import Link from "next/link";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";
import Logo from "@/components/Logo";

export function MobileHeaderContent() {
  const { isMobile } = useSidebar();

  if (!isMobile) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background p-4 flex items-center border-b h-14 lg:hidden">
      <SidebarTrigger className="p-2 rounded-md hover:bg-muted flex items-center justify-center">
        <Menu className="h-5 w-5" />
      </SidebarTrigger>
      <Link href="/dashboard" className="ml-4 flex items-center">
        <Logo width={26} height={26} />
      </Link>
    </div>
  );
}
