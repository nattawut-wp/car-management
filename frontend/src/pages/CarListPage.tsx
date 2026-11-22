import { CarFrontIcon, PlusIcon, RefreshCwIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CarTable, CarTableSkeleton } from "@/features/cars/components/CarTable";
import { useCars } from "@/features/cars/hooks/useCars";

export function CarListPage() {
  const { state, reload, removeFromList } = useCars();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            <span className="text-brand-gradient">Cars</span>
          </h1>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            All company cars
            {state.status === "success" && <Badge variant="secondary">{state.data.length}</Badge>}
          </p>
        </div>
        <Button render={<Link to="/cars/new" />} nativeButton={false}>
          <PlusIcon />
          Add car
        </Button>
      </div>

      <Card>
        <CardContent>
          {state.status === "loading" && <CarTableSkeleton />}

          {state.status === "error" && (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <p className="text-destructive">{state.message}</p>
              <Button variant="outline" onClick={reload}>
                <RefreshCwIcon />
                Try again
              </Button>
            </div>
          )}

          {state.status === "success" && state.data.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <CarFrontIcon className="size-10 text-muted-foreground" />
              <p className="font-medium">No cars yet</p>
              <p className="text-sm text-muted-foreground">Add the first company car to get started.</p>
            </div>
          )}

          {state.status === "success" && state.data.length > 0 && (
            <CarTable cars={state.data} onDeleted={removeFromList} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
