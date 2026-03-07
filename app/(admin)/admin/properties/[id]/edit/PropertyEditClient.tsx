"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PropertySheet } from "@/components/admin/properties/PropertySheet";
import { getPropertyByIdAction } from "@/lib/actions/properties";
import type { PropertyWithRelations } from "@/types";

interface PropertyEditClientProps {
  propertyId: string;
}

export function PropertyEditClient({ propertyId }: PropertyEditClientProps) {
  const router = useRouter();
  const [property, setProperty] = useState<
    PropertyWithRelations | null | undefined
  >(undefined);

  useEffect(() => {
    let cancelled = false;
    getPropertyByIdAction(propertyId).then((p) => {
      if (!cancelled) setProperty(p ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [propertyId]);

  const handleOpenChange = (open: boolean) => {
    if (!open) router.push("/admin/properties");
  };

  if (property === undefined) {
    return (
      <div className="text-sm text-gray-400 animate-pulse">
        Loading property…
      </div>
    );
  }

  if (property === null) {
    return <div className="text-sm text-destructive">Property not found.</div>;
  }

  return (
    <PropertySheet
      open={true}
      onOpenChange={handleOpenChange}
      property={property}
    />
  );
}
