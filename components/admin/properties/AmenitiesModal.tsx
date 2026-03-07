"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useAmenitiesForAdmin,
  useCreateAmenity,
  useDeleteAmenity,
} from "@/hooks/useAmenities";
import { Loader2, Plus, Trash2 } from "lucide-react";

interface AmenitiesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AmenitiesModal({ open, onOpenChange }: AmenitiesModalProps) {
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("");
  const { data: amenities = [], isLoading } = useAmenitiesForAdmin();
  const createAmenity = useCreateAmenity();
  const deleteAmenity = useDeleteAmenity();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    await createAmenity.mutateAsync({
      name: newName.trim(),
      icon: newIcon.trim() || undefined,
    });
    setNewName("");
    setNewIcon("");
  };

  const handleDelete = async (id: string) => {
    await deleteAmenity.mutateAsync(id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl border-gray-100 shadow-2xl p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Manage Amenities
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-sm mt-1">
              Add or remove amenities available for properties
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          <form onSubmit={handleAdd} className="flex gap-3">
            <div className="flex-1 space-y-1">
              <Label
                htmlFor="amenity-name"
                className="text-xs font-bold text-gray-600"
              >
                New amenity
              </Label>
              <div className="flex gap-2">
                <Input
                  id="amenity-name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g., Swimming Pool"
                  className="h-10 rounded-xl"
                />
                <Input
                  value={newIcon}
                  onChange={(e) => setNewIcon(e.target.value)}
                  placeholder="🏊"
                  className="h-10 w-16 rounded-xl text-center text-lg"
                  maxLength={4}
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={!newName.trim() || createAmenity.isPending}
              className="h-10 px-4 rounded-xl bg-gray-900 hover:bg-gray-800 shrink-0 mt-6"
            >
              {createAmenity.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1.5" />
                  Add
                </>
              )}
            </Button>
          </form>

          <div>
            <Label className="text-xs font-bold text-gray-600 block mb-3">
              Existing amenities
            </Label>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : amenities.length === 0 ? (
              <p className="text-sm text-gray-400 italic py-4">
                No amenities yet. Add one above.
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {amenities.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100"
                  >
                    <span className="flex items-center gap-2 font-medium text-gray-900">
                      {a.icon && <span>{a.icon}</span>}
                      {a.name}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0"
                      onClick={() => handleDelete(a.id)}
                      disabled={deleteAmenity.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
