import { PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function CarListPage() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Cars</h1>
        <p className="text-sm text-muted-foreground">All company cars</p>
      </div>
      <Button render={<Link to="/cars/new" />} nativeButton={false}>
        <PlusIcon />
        Add car
      </Button>
    </div>
  );
}
