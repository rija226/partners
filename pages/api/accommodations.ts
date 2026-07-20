import type { NextApiRequest, NextApiResponse } from "next";
import { getAccommodations } from "@third-party/services/contentful-service";
import type { Entry } from "@adapters/contentful-response.adapter";
import type { Accommodation } from "@/src/types/accommodation.types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Entry<Accommodation>[]>,
) {
  const accommodations = await getAccommodations();
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
  res.status(200).json(accommodations);
}
