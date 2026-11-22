import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { Controller, useForm, type Control } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toApiError } from "@/lib/apiError";
import { carFormSchema, toCarPayload, type CarFormValues } from "../schema";
import type { CarPayload } from "../types";

interface CarFormProps {
  defaultValues: CarFormValues;
  submitLabel: string;
  onSubmit: (payload: CarPayload) => Promise<void>;
}

function isCarFormField(field: string): field is keyof CarFormValues {
  return field in carFormSchema.shape;
}

export function CarForm({ defaultValues, submitLabel, onSubmit }: CarFormProps) {
  const form = useForm<CarFormValues>({
    resolver: zodResolver(carFormSchema),
    defaultValues,
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await onSubmit(toCarPayload(values));
    } catch (err) {
      const apiError = toApiError(err);
      const fieldErrors = apiError.fieldErrors.filter(({ field }) => isCarFormField(field));

      if (fieldErrors.length === 0) {
        toast.error(apiError.message);
        return;
      }
      for (const { field, message } of fieldErrors) {
        if (isCarFormField(field)) {
          form.setError(field, { message }, { shouldFocus: true });
        }
      }
    }
  });

  const { control, formState } = form;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FieldGroup>
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField
            control={control}
            name="registrationNumber"
            label="Registration number"
            placeholder="1กข 1234 กรุงเทพมหานคร"
            required
          />
          <TextField control={control} name="brand" label="Brand" placeholder="Toyota" required />
          <TextField control={control} name="model" label="Model" placeholder="Yaris" required />
          <TextField control={control} name="year" label="Year" placeholder="2024" inputMode="numeric" />
          <TextField control={control} name="color" label="Color" placeholder="White" />
        </div>
        <TextField
          control={control}
          name="notes"
          label="Notes"
          placeholder="Anything worth remembering about this car"
          multiline
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" render={<Link to="/" />} nativeButton={false}>
            Cancel
          </Button>
          <Button type="submit" disabled={formState.isSubmitting}>
            {formState.isSubmitting && <Loader2Icon className="animate-spin" />}
            {submitLabel}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}

interface TextFieldProps {
  control: Control<CarFormValues>;
  name: keyof CarFormValues;
  label: string;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
  inputMode?: "numeric";
}

function TextField({ control, name, label, placeholder, required, multiline, inputMode }: TextFieldProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>
            {label}
            {required && <span className="text-destructive">*</span>}
          </FieldLabel>
          {multiline ? (
            <Textarea
              {...field}
              id={name}
              placeholder={placeholder}
              rows={4}
              aria-invalid={fieldState.invalid}
            />
          ) : (
            <Input
              {...field}
              id={name}
              placeholder={placeholder}
              inputMode={inputMode}
              aria-invalid={fieldState.invalid}
            />
          )}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
