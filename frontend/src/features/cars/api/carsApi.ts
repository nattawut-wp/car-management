import { apiClient } from "@/lib/apiClient";
import type { Car, CarPayload } from "../types";

export async function getCars(): Promise<Car[]> {
  const { data } = await apiClient.get<Car[]>("/cars");
  return data;
}

export async function getCar(id: number): Promise<Car> {
  const { data } = await apiClient.get<Car>(`/cars/${id}`);
  return data;
}

export async function createCar(payload: CarPayload): Promise<Car> {
  const { data } = await apiClient.post<Car>("/cars", payload);
  return data;
}

export async function updateCar(id: number, payload: CarPayload): Promise<Car> {
  const { data } = await apiClient.put<Car>(`/cars/${id}`, payload);
  return data;
}

export async function deleteCar(id: number): Promise<void> {
  await apiClient.delete(`/cars/${id}`);
}
