"use client";

import { useParams } from "next/navigation";
import { PropertyDetailPublicClient } from "./PropertyDetailPublicClient";

export default function PublicPropertyDetailPage() {
  const params = useParams();
  const identifier = typeof params?.id === "string" ? params.id : "";
  return <PropertyDetailPublicClient identifier={identifier} />;
}
