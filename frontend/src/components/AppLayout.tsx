import { CarFrontIcon, PlusIcon } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function AppLayout() {
  return (
    <div className="min-h-svh bg-background">
      <header className="sticky top-0 z-10 border-b bg-card shadow-xs">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <Link to="/" className="flex items-center gap-2">
            <CarFrontIcon className="size-6 text-primary" />
            <span className="text-xl font-bold tracking-tight text-primary">HAUP</span>
            <span className="hidden text-sm font-medium text-muted-foreground sm:inline">
              Car Management
            </span>
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="border-primary text-primary hover:bg-accent hover:text-primary"
            render={<Link to="/cars/new" />}
            nativeButton={false}
          >
            <PlusIcon />
            Add car
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
