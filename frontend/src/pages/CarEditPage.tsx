import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { updateCar } from "@/features/cars/api/carsApi";
import { CarForm } from "@/features/cars/components/CarForm";
import { useCar } from "@/features/cars/hooks/useCars";
import { toCarFormValues } from "@/features/cars/schema";
import type { CarPayload } from "@/features/cars/types";
import { NotFoundPage } from "./NotFoundPage";

export function CarEditPage() {
  const id = Number(useParams().id);

  if (!Number.isInteger(id) || id <= 0) {
    return <NotFoundPage />;
  }
  return <CarEditForm key={id} id={id} />;
}

function CarEditForm({ id }: { id: number }) {
  const navigate = useNavigate();
  const state = useCar(id);

  async function handleUpdate(payload: CarPayload) {
    const car = await updateCar(id, payload);
    toast.success(`Saved ${car.registrationNumber}`);
    navigate("/");
  }

  if (state.status === "error" && state.httpStatus === 404) {
    return <NotFoundPage />;
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Edit car</CardTitle>
        <CardDescription>
          {state.status === "success" ? state.data.registrationNumber : "Fields marked * are required."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {state.status === "loading" && (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}
        {state.status === "error" && <p className="text-destructive">{state.message}</p>}
        {state.status === "success" && (
          <CarForm
            defaultValues={toCarFormValues(state.data)}
            submitLabel="Save changes"
            onSubmit={handleUpdate}
          />
        )}
      </CardContent>
    </Card>
  );
}
