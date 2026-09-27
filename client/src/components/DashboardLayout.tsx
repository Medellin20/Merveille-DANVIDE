import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/useMobile";
import { trpc } from "@/lib/trpc";
import { Eye, LayoutDashboard, LogOut, PanelLeft } from "lucide-react";
import { CSSProperties, FormEvent, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { DashboardLayoutSkeleton } from "./DashboardLayoutSkeleton";
import { Button } from "./ui/button";

const menuItems = [
  { icon: LayoutDashboard, label: "Gérer le contenu", path: "/admin" },
  { icon: Eye, label: "Voir le portfolio", path: "/" },
];

const SIDEBAR_WIDTH_KEY = "sidebar-width";
const DEFAULT_WIDTH = 268;
const MIN_WIDTH = 220;
const MAX_WIDTH = 420;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
  });
  const { loading, user } = useAuth();

  useEffect(() => { localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString()); }, [sidebarWidth]);

  if (loading) return <DashboardLayoutSkeleton />;
  if (!user) return <AdminPasswordLogin />;

  return <SidebarProvider style={{ "--sidebar-width": `${sidebarWidth}px` } as CSSProperties}><DashboardLayoutContent setSidebarWidth={setSidebarWidth}>{children}</DashboardLayoutContent></SidebarProvider>;
}

function AdminPasswordLogin() {
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const utils = trpc.useUtils();
  const login = trpc.auth.adminLogin.useMutation({
    onSuccess: async () => {
      setErrorMessage("");
      await utils.auth.me.invalidate();
    },
    onError: error => setErrorMessage(error.message),
  });

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login.mutate({ password });
  };

  return <div className="flex min-h-screen items-center justify-center bg-[#111619] px-5"><form onSubmit={submit} className="w-full max-w-md bg-[#f6f3ee] p-8 text-center sm:p-12"><span className="mx-auto flex h-12 w-12 items-center justify-center bg-[#e9bb22] font-black text-[#111619]">MD</span><p className="mt-7 text-[10px] font-black uppercase tracking-[0.25em] text-[#111619]/45">Studio portfolio</p><h1 className="mt-4 font-serif text-4xl tracking-[-.04em]">Accès privé</h1><p className="mt-4 text-sm leading-6 text-[#111619]/55">Saisissez le mot de passe pour gérer votre portfolio et vos contenus.</p><label className="mt-7 block text-left text-[10px] font-black uppercase tracking-[0.15em] text-[#111619]/45">Mot de passe<input autoComplete="current-password" type="password" value={password} onChange={event => setPassword(event.target.value)} required className="mt-2 h-12 w-full border border-[#111619]/15 bg-white px-3 text-sm outline-none focus:border-[#e1b31c]" /></label>{errorMessage && <p role="alert" className="mt-3 text-left text-sm text-red-700">{errorMessage}</p>}<Button type="submit" disabled={login.isPending} className="mt-6 h-auto w-full rounded-none bg-[#111619] py-4 text-[10px] font-black uppercase tracking-[0.18em] text-white hover:bg-[#263339]">{login.isPending ? "Vérification…" : "Ouvrir l’espace admin"} <span className="ml-1 text-[#e9bb22]">↗</span></Button></form></div>;
}

type DashboardLayoutContentProps = { children: React.ReactNode; setSidebarWidth: (width: number) => void };

function DashboardLayoutContent({ children, setSidebarWidth }: DashboardLayoutContentProps) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const activeMenuItem =
    menuItems.find((item) => item.path === location) ?? menuItems[0]!;
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => { if (isCollapsed) setIsResizing(false); }, [isCollapsed]);
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => { if (!isResizing) return; const left = sidebarRef.current?.getBoundingClientRect().left ?? 0; const next = event.clientX - left; if (next >= MIN_WIDTH && next <= MAX_WIDTH) setSidebarWidth(next); };
    const handleMouseUp = () => setIsResizing(false);
    if (isResizing) { document.addEventListener("mousemove", handleMouseMove); document.addEventListener("mouseup", handleMouseUp); document.body.style.cursor = "col-resize"; document.body.style.userSelect = "none"; }
    return () => { document.removeEventListener("mousemove", handleMouseMove); document.removeEventListener("mouseup", handleMouseUp); document.body.style.cursor = ""; document.body.style.userSelect = ""; };
  }, [isResizing, setSidebarWidth]);

  return <>
    <div className="relative" ref={sidebarRef}>
      <Sidebar collapsible="icon" className="border-r-0 bg-[#111619] text-white" disableTransition={isResizing}>
        <SidebarHeader className="h-20 justify-center border-b border-white/10"><div className="flex w-full items-center gap-3 px-2"><button onClick={toggleSidebar} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white" aria-label="Ouvrir ou réduire le menu"><PanelLeft className="h-4 w-4" /></button>{!isCollapsed && <div className="min-w-0"><p className="text-[11px] font-black uppercase tracking-[0.2em] text-white">MD Studio</p><p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-[#85cce3]">Espace admin</p></div>}</div></SidebarHeader>
        <SidebarContent className="gap-0"><p className="px-4 pb-3 pt-7 text-[9px] font-black uppercase tracking-[0.2em] text-white/30 group-data-[collapsible=icon]:hidden">Navigation</p><SidebarMenu className="gap-1 px-2 py-1">{menuItems.map(item => { const isActive = location === item.path; return <SidebarMenuItem key={item.label}><SidebarMenuButton isActive={isActive} onClick={() => setLocation(item.path)} tooltip={item.label} className={`h-11 font-normal text-white/60 hover:bg-white/10 hover:text-white ${isActive ? "bg-[#e9bb22] text-[#111619] hover:bg-[#e9bb22] hover:text-[#111619]" : ""}`}><item.icon className="h-4 w-4" /><span>{item.label}</span></SidebarMenuButton></SidebarMenuItem>; })}</SidebarMenu></SidebarContent>
        <SidebarFooter className="border-t border-white/10 p-3"><DropdownMenu><DropdownMenuTrigger asChild><button className="flex w-full items-center gap-3 rounded-lg px-1 py-2 text-left transition-colors hover:bg-white/10"><Avatar className="h-9 w-9 shrink-0 border border-[#e9bb22]/50"><AvatarFallback className="bg-[#e9bb22] text-xs font-black text-[#111619]">{user?.name?.charAt(0).toUpperCase() || "M"}</AvatarFallback></Avatar><div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden"><p className="truncate text-xs font-bold text-white">{user?.name || "Merveille Danvide"}</p><p className="mt-1 truncate text-[10px] text-white/40">{user?.email || "Administratrice"}</p></div></button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-48"><DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:text-destructive"><LogOut className="mr-2 h-4 w-4" /> Déconnexion</DropdownMenuItem></DropdownMenuContent></DropdownMenu></SidebarFooter>
      </Sidebar>
      <div className={`absolute right-0 top-0 z-50 h-full w-1 cursor-col-resize transition-colors hover:bg-[#e9bb22]/50 ${isCollapsed ? "hidden" : ""}`} onMouseDown={() => !isCollapsed && setIsResizing(true)} />
    </div>
    <SidebarInset className="bg-[#f6f3ee]"><>{isMobile && <div className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-[#111619]/10 bg-[#f6f3ee]/95 px-3 backdrop-blur"><SidebarTrigger className="h-9 w-9" /><span className="text-xs font-bold">{activeMenuItem.label}</span></div>}<main className="flex-1 p-4">{children}</main></></SidebarInset>
  </>;
}
