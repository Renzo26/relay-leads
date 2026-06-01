import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutGrid, Users, Info, BarChart2 } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Pipeline", icon: LayoutGrid, exact: true },
  { to: "/leads", label: "Leads", icon: Users, exact: false },
  { to: "/dashboard", label: "Dashboard", icon: BarChart2, exact: false },
  { to: "/sobre", label: "Sobre", icon: Info, exact: false },
];

export function AppLayout({
  children,
  title,
  action,
}: {
  children: ReactNode;
  title: string;
  action?: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden md:flex w-60 flex-col border-r border-sidebar-border bg-sidebar">
        <div className="flex h-16 items-center gap-2 px-6 border-b border-sidebar-border">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold tracking-tight">
            4i
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold">4Improvements</span>
            <span className="text-[11px] text-muted-foreground">Gestão de Leads</span>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const active = item.exact
              ? pathname === item.to
              : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 text-xs text-muted-foreground border-t border-sidebar-border">
          v0.1 · 4Improvements
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between gap-4 px-6 md:px-8 border-b border-border bg-card/50 backdrop-blur">
          <h1 className="text-lg md:text-xl font-semibold tracking-tight">{title}</h1>
          <div className="flex items-center gap-2">{action}</div>
        </header>
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
