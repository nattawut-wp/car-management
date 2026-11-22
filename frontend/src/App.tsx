import { Route, Routes } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Toaster } from "@/components/ui/sonner";
import { CarCreatePage } from "@/pages/CarCreatePage";
import { CarEditPage } from "@/pages/CarEditPage";
import { CarListPage } from "@/pages/CarListPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<CarListPage />} />
          <Route path="cars/new" element={<CarCreatePage />} />
          <Route path="cars/:id/edit" element={<CarEditPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <Toaster richColors position="top-right" />
    </>
  );
}
