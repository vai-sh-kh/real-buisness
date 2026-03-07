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
import { useScrollToFirstError } from "@/hooks/useScrollToFirstError";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";
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

export function CategorySheet({
  open,
  onOpenChange,
  category,
}: CategorySheetProps) {
  const isMobile = useIsMobile();
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

  useScrollToFirstError(errors, { fieldIdMap: { name: "cat-name" } });

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
      await createMutation.mutateAsync(
        values as Pick<Category, "name" | "description" | "icon" | "is_active">,
      );
    }
    onOpenChange(false);
    reset();
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={cn(
          "w-full p-0 overflow-hidden bg-white/95 backdrop-blur-xl flex flex-col",
          isMobile
            ? "max-h-[90vh] rounded-t-2xl border-t border-gray-100"
            : "sm:max-w-4xl border-l border-gray-100",
        )}
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="mb-4">
              <SheetTitle className="text-xl font-bold text-white leading-tight">
                {isEditing ? "Modify Category" : "New Category"}
              </SheetTitle>
              <SheetDescription className="text-gray-400 text-xs mt-1">
                {isEditing
                  ? "Adjust category parameters and visibility"
                  : "Define a new property classification"}
              </SheetDescription>
            </div>
          </div>
          {/* Decorative shapes */}
          <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl shrink-0" />
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto p-8 space-y-8 pb-32">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="cat-name"
                  className="text-xs font-bold text-gray-700 ml-1"
                >
                  Category Name *
                </Label>
                <Input
                  id="cat-name"
                  {...register("name")}
                  placeholder="e.g., Residential, Commercial"
                  className="h-12 rounded-xl border-gray-200 focus:ring-indigo-500 text-base"
                />
                {errors.name && (
                  <p className="text-xs text-destructive font-medium ml-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="cat-icon"
                  className="text-xs font-bold text-gray-700 ml-1"
                >
                  Icon reference
                </Label>
                <Input
                  id="cat-icon"
                  {...register("icon")}
                  placeholder="🏠 or home"
                  className="h-12 rounded-xl border-gray-200 focus:ring-indigo-500 text-base"
                />
                <p className="text-[10px] text-gray-400 ml-1 italic">
                  Use an emoji or a specific icon name.
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="cat-desc"
                  className="text-xs font-bold text-gray-700 ml-1"
                >
                  Category Description
                </Label>
                <Textarea
                  id="cat-desc"
                  {...register("description")}
                  placeholder="How would you describe this category?"
                  className="min-h-[120px] rounded-2xl border-gray-200 focus:ring-indigo-500 p-4 leading-relaxed text-sm"
                />
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <Checkbox
                  id="cat-active"
                  checked={watch("is_active")}
                  onCheckedChange={(v) => setValue("is_active", Boolean(v))}
                  className="h-5 w-5 rounded-md border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <div className="space-y-0.5">
                  <Label
                    htmlFor="cat-active"
                    className="text-sm font-bold text-gray-900 cursor-pointer"
                  >
                    Visibility Status
                  </Label>
                  <p className="text-[11px] text-gray-500">
                    Enable this to make the category visible to public users.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-gray-100 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="flex-1 rounded-xl h-10 font-medium text-gray-600 bg-white border-gray-200 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-xl h-10 bg-gray-900 hover:bg-gray-800 text-white font-medium text-sm shadow-sm transition-all active:scale-[0.98]"
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isEditing ? "Save Activity" : "Launch Category"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
