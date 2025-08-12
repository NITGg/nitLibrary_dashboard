"use server";

import { OffersStatsResponse } from "@/app/[locale]/offers/OffersChartsData";
import { FetchChartParams } from "@/types/charts";
import axios from "axios";
import { cookies } from "next/headers";

export async function fetchOffersStats(params?: FetchChartParams): Promise<{
  data: OffersStatsResponse | null;
  error: string | null;
}> {
  try {
    const token = cookies().get("token")?.value;
    if (!token) return { data: null, error: "No token provided" };

    const queryParams = new URLSearchParams();
    if (params) {
      if (params.byDates) {
        queryParams.append("byDates", "true");
      }
      if (params.dateType) {
        queryParams.append("dateType", params.dateType);
      }
      if (params.from) {
        queryParams.append("from", params.from.toISOString());
      }
      if (params.to) {
        queryParams.append("to", params.to.toISOString());
      }
    }

    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/offers/stats/byTypes${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const { data } = await axios.get(url, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { data, error: null };
  } catch (error: any) {
    console.error("Error fetching offers stats:", error.message);
    if (axios.isAxiosError(error)) {
      return {
        data: null,
        error: error.message,
      };
    }
    return { data: null, error: error?.message };
  }
}
