"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateCategory, useUpdateCategory } from "@/hooks/useCategories";
import type { Category } from "@/types";
import { Loader2 } from "lucide-react";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  is_active: z.boolean().default(true),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategorySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
}

export function CategorySheet({ open, onOpenChange, category }: CategorySheetProps) {
  const isEditing = !!category;
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", description: null, icon: null, is_active: true },
  });

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        description: category.description,
        icon: category.icon,
        is_active: category.is_active,
      });
    } else {
      reset({ name: "", description: null, icon: null, is_active: true });
    }
  }, [category, reset]);

  const isPending = createMutation.isPending || updateMutation.isPending;

  async function onSubmit(values: CategoryFormValues) {
    if (isEditing && category) {
      await updateMutation.mutateAsync({ id: category.id, values });
    } else {
      await createMutation.mutateAsync(values as Pick<Category, "name" | "description" | "icon" | "is_active">);
    }
    onOpenChange(false);
    reset();
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{isEditing ? "Edit Category" : "Add Category"}</SheetTitle>
          <SheetDescription>
            {isEditing ? "Update category details." : "Create a new property category."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-6">
          <div className="space-y-1.5">
            <Label htmlFor="cat-name">Name *</Label>
            <Input
              id="cat-name"
              {...register("name")}
              placeholder="e.g., Residential, Commercial"
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cat-icon">Icon (emoji or icon name)</Label>
            <Input
              id="cat-icon"
              {...register("icon")}
              placeholder="🏠 or home"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cat-desc">Description</Label>
            <Textarea
              id="cat-desc"
              {...register("description")}
              placeholder="Brief description of this category..."
              rows={3}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="cat-active"
              checked={watch("is_active")}
              onCheckedChange={(v) => setValue("is_active", Boolean(v))}
            />
            <Label htmlFor="cat-active" className="cursor-pointer">
              Active (visible on site)
            </Label>
          </div>

          <SheetFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Save Changes" : "Create Category"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
