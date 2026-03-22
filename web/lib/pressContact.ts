export type PressContactRow = {
  id: string;
  outlet: string;
  contact_name: string | null;
  role_or_beat: string | null;
  email: string | null;
  url: string | null;
  region: string | null;
  tags: string | null;
  category: string | null;
  notes: string | null;
  status: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

/** Public tools view — no internal `notes` or pipeline `status`. */
export type PublicPressContactRow = Omit<PressContactRow, "notes" | "status" | "created_at" | "updated_at">;

export function pressRowSearchBlob(r: Pick<PressContactRow, "outlet" | "contact_name" | "role_or_beat" | "email" | "url" | "region" | "tags" | "category" | "notes" | "status">): string {
  return [
    r.outlet,
    r.contact_name,
    r.role_or_beat,
    r.email,
    r.url,
    r.region,
    r.tags,
    r.category,
    r.notes,
    r.status,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function publicPressSearchBlob(r: Pick<PublicPressContactRow, "outlet" | "contact_name" | "role_or_beat" | "email" | "url" | "region" | "tags" | "category">): string {
  return [
    r.outlet,
    r.contact_name,
    r.role_or_beat,
    r.email,
    r.url,
    r.region,
    r.tags,
    r.category,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}
