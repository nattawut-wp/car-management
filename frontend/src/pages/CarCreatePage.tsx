import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createCar } from "@/features/cars/api/carsApi";
import { CarForm } from "@/features/cars/components/CarForm";
import { emptyCarFormValues } from "@/features/cars/schema";
import type { CarPayload } from "@/features/cars/types";

export function CarCreatePage() {
  const navigate = useNavigate();

  async function handleCreate(payload: CarPayload) {
    const car = await createCar(payload);
    toast.success(`Added ${car.registrationNumber}`);
    navigate("/");
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Add car</CardTitle>
        <CardDescription>Fields marked * are required.</CardDescription>
      </CardHeader>
      <CardContent>
        <CarForm defaultValues={emptyCarFormValues} submitLabel="Add car" onSubmit={handleCreate} />
      </CardContent>
    </Card>
  );
}
