import { PencilIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Car } from "../types";
import { DeleteCarDialog } from "./DeleteCarDialog";

const COLUMNS = ["Registration number", "Brand", "Model", "Year", "Color", "Notes"];

function CarTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        {COLUMNS.map((column) => (
          <TableHead key={column}>{column}</TableHead>
        ))}
        <TableHead className="w-24 text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}

interface CarTableProps {
  cars: Car[];
  onDeleted: (id: number) => void;
}

export function CarTable({ cars, onDeleted }: CarTableProps) {
  return (
    <Table>
      <CarTableHeader />
      <TableBody>
        {cars.map((car) => (
          <TableRow key={car.id}>
            <TableCell className="font-medium">{car.registrationNumber}</TableCell>
            <TableCell>{car.brand}</TableCell>
            <TableCell>{car.model}</TableCell>
            <TableCell>{car.year ?? "—"}</TableCell>
            <TableCell>{car.color ?? "—"}</TableCell>
            <TableCell
              className="max-w-56 truncate text-muted-foreground"
              title={car.notes ?? undefined}
            >
              {car.notes ?? "—"}
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Edit ${car.registrationNumber}`}
                render={<Link to={`/cars/${car.id}/edit`} />}
                nativeButton={false}
              >
                <PencilIcon />
              </Button>
              <DeleteCarDialog car={car} onDeleted={onDeleted} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function CarTableSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <Table>
      <CarTableHeader />
      <TableBody>
        {Array.from({ length: rows }, (_, row) => (
          <TableRow key={row}>
            {Array.from({ length: COLUMNS.length + 1 }, (_, cell) => (
              <TableCell key={cell}>
                <Skeleton className="h-4 w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
