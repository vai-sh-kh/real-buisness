import { PropertyEditClient } from "./PropertyEditClient";

type Props = { params: Promise<{ id: string }> };

export default async function PropertyEditPage({ params }: Props) {
  const { id } = await params;
  return <PropertyEditClient propertyId={id} />;
}
