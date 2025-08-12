"use server";

import { OrdersStatsResponse } from "@/app/[locale]/orders/OrdersChartsData";
import { FetchChartParams } from "@/types/charts";
import axios from "axios";
import { cookies } from "next/headers";

export async function fetchOrdersStats(params?: FetchChartParams): Promise<{
  data: OrdersStatsResponse | null;
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
        const fromDate = new Date(params.from);
        // Convert to Saudi Arabia timezone and set to start of day
        const saudiFromDate = new Date(
          fromDate.toLocaleString("en-US", { timeZone: "Asia/Riyadh" })
        );
        saudiFromDate.setHours(0, 0, 0, 0);
        queryParams.append("from", saudiFromDate.toISOString());
      }
      if (params.to) {
        const toDate = new Date(params.to);
        // Convert to Saudi Arabia timezone and set to end of day
        const saudiToDate = new Date(
          toDate.toLocaleString("en-US", { timeZone: "Asia/Riyadh" })
        );
        saudiToDate.setHours(23, 59, 59, 999);
        queryParams.append("to", saudiToDate.toISOString());
      }
      if (params.brandIds && params.brandIds.length > 0) {
        queryParams.append("brandIds", params.brandIds.join(","));
      }
    }

    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/byBrands${
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
    if (axios.isAxiosError(error)) {
      return {
        data: null,
        error: error.message,
      };
    }
    return { data: null, error: error?.message };
  }
}
