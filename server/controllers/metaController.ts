import type { Request, Response } from "express";
import { OfficeSpace } from "../models/OfficeSpace";

export async function getAmenities(_req: Request, res: Response) {
  const docs = await OfficeSpace.find({}, { amenities: 1 }).lean();
  const amenities = Array.from(
    new Set(
      docs.flatMap((doc: any) => (Array.isArray(doc.amenities) ? doc.amenities : [])),
    ),
  );
  res.json({ amenities });
}

export function healthCheck(_req: Request, res: Response) {
  res.json({ ok: true });
}
