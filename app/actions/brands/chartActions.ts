"use server";

import { BrandAnalyticsResponse } from "@/app/[locale]/brands/BrandAnalyticsData";
import { FetchChartParams } from "@/types/charts";
import axios from "axios";
import { cookies } from "next/headers";

export async function fetchBrandAnalytics(
  params?: FetchChartParams
): Promise<{
  data: BrandAnalyticsResponse | null;
  error: string | null;
}> {
  try {
    const token = cookies().get("token")?.value;
    if (!token) return { data: null, error: "No token provided" };

    const queryParams = new URLSearchParams();

    if (params) {
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

    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/analytics`;
    // Fetch date chart data
    const { data } = await axios.get(
      `${url}?${queryParams.toString()}`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      data,
      error: null,
    };
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return {
        data: null,
        error: error.message,
      };
    }
    return { data: null, error: error?.message };
  }
}
