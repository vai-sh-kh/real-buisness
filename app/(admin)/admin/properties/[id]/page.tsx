import { PropertyDetailClient } from "./PropertyDetailClient";

type Props = { params: Promise<{ id: string }> };

export default async function PropertyDetailPage({ params }: Props) {
  const { id: identifier } = await params;
  return <PropertyDetailClient identifier={identifier} />;
}
