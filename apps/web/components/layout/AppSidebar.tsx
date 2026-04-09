"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  Calendar,
  User,
  LogIn,
  Menu,
  ChevronLeft,
  PanelLeftIcon,
  LogOut,
  MessageCirclePlus,
  Shield,
  LayoutDashboard,
  Users,
  FileText,
  Receipt,
  History,
} from "lucide-react";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { logoutAction } from "@/app/actions/auth";
import { SidebarThemeSwitcher } from "@/components/SidebarThemeSwitcher";
import { UsageTracker } from "@/components/chat/UsageTracker";
import Logo from "../Logo";

function isNavActive(pathname: string, href: string): boolean {
  if (href === "/chat") {
    return pathname.startsWith("/chat");
  }
  if (href.startsWith("/admin")) {
    return pathname.startsWith("/admin");
  }
  if (href === "/history") {
    return pathname.startsWith("/history");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { open, isMobile, toggleSidebar } = useSidebar();
  const { id: userId, role: userRole } = useUser();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navItems = [
    { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
    { href: "/clients", label: "Clients", icon: Users },
    { href: "/devis", label: "Devis", icon: FileText },
    { href: "/factures", label: "Factures", icon: Receipt },
    { href: "/agenda", label: "Agenda", icon: Calendar },
    { href: "/chat", label: "Assistant", icon: MessageCirclePlus },
    { href: "/history", label: "Historique", icon: History },
    { href: "/profile", label: "Profil", icon: User },
    ...(userRole === "admin"
      ? [{ href: "/admin/models", label: "Admin", icon: Shield }]
      : []),
  ];

  const renderContentAsOpen = open || isMobile;

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const result = await logoutAction();

      if (result.success) {
        toast.success("Déconnexion réussie.");
        router.push("/");
      } else {
        toast.error(result.error);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Échec de la déconnexion";
      toast.error(errorMessage);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleNavClick = () => {
    if (isMobile) {
      toggleSidebar();
    }
  };

  const handleChatClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleNavClick();
    window.location.href = "/chat";
  };

  const getLinkClasses = (href: string) => {
    const active = isNavActive(pathname, href);
    return cn(
      "flex items-center w-full rounded-md text-base font-medium transition-colors",
      active
        ? "bg-primary text-white [&>*]:text-white"
        : "hover:bg-white dark:hover:bg-gray-800",
      renderContentAsOpen ? "px-3 py-2" : "h-9 w-9 justify-center p-0"
    );
  };

  return (
    <Sidebar collapsible="icon" className="border-r bg-sidebar">
      <SidebarHeader
        className={cn(
          "flex items-center gap-2 h-14 border-b",
          renderContentAsOpen
            ? "flex-row justify-between px-4"
            : "justify-center px-2"
        )}
      >
        {renderContentAsOpen && (
          <Link
            href="/dashboard"
            className="pl-2 flex items-center"
            onClick={handleNavClick}
          >
            <Logo className="text-xl" width={26} height={26} />
          </Link>
        )}

        {!isMobile && (
          <SidebarTrigger
            aria-label={open ? "Réduire le menu" : "Agrandir le menu"}
            aria-expanded={open}
            className="p-1 rounded-md hover:bg-muted transition-colors"
          >
            {open ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </SidebarTrigger>
        )}

        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="p-1 h-auto w-auto"
            onClick={() => toggleSidebar()}
          >
            <PanelLeftIcon className="h-6 w-6" />
            <span className="sr-only">Fermer le menu</span>
          </Button>
        )}
      </SidebarHeader>
      <SidebarContent className="flex-grow p-2 flex flex-col">
        <SidebarGroup>
          <SidebarMenu className="space-y-1">
            {navItems.map((item) => (
              <SidebarMenuItem
                key={item.href}
                className={cn(
                  "flex justify-center",
                  renderContentAsOpen && "px-2"
                )}
              >
                <Link
                  href={item.href}
                  className={getLinkClasses(item.href)}
                  onClick={
                    item.href === "/chat" ? handleChatClick : handleNavClick
                  }
                >
                  <item.icon
                    className={cn(
                      renderContentAsOpen ? "h-6 w-6 mr-3" : "h-5 w-5"
                    )}
                  />
                  {renderContentAsOpen && <span>{item.label}</span>}
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <div className="mt-auto px-2 pb-2">
          {renderContentAsOpen && userId ? <UsageTracker /> : null}
        </div>
      </SidebarContent>
      <SidebarFooter className="py-4 border-t flex flex-col space-y-2">
        <div
          className={cn(
            "flex w-full",
            renderContentAsOpen ? "justify-start px-3" : "justify-center"
          )}
        >
          <SidebarThemeSwitcher />
        </div>

        {userId ? (
          renderContentAsOpen ? (
            <LogoutButton />
          ) : (
            <div className="flex justify-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">
                  {isLoggingOut ? "Déconnexion…" : "Déconnexion"}
                </span>
              </Button>
            </div>
          )
        ) : (
          <Link href="/auth/login" className="w-full">
            <Button
              variant="ghost"
              className={cn(
                "flex items-center",
                renderContentAsOpen
                  ? "w-full justify-start px-3"
                  : "h-8 w-8 justify-center"
              )}
            >
              <LogIn
                className={cn(renderContentAsOpen ? "h-5 w-5 mr-3" : "h-5 w-5")}
              />
              {renderContentAsOpen && "Connexion"}
              {!renderContentAsOpen && <span className="sr-only">Connexion</span>}
            </Button>
          </Link>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
