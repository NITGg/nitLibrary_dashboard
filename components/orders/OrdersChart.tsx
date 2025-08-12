"use client";
import { OrdersStatsResponse } from "@/app/[locale]/orders/OrdersChartsData";
import { fetchOrdersStats } from "@/app/actions/orders/chartActions";
import BarChartComponent from "@/components/charts/BarChart";
import DateChart from "@/components/charts/DateChart";
import PieChartComponent from "@/components/charts/PieChart";
import DateRange from "@/components/DateRange";
import { Select } from "@/components/ui/select";
import FetchSelect from "@/components/FetchSelect";
import { chartTypes, getDateTypeOptions } from "@/lib/charts";
import { ChartType, DateType } from "@/types/charts";
import { Brand } from "@/types/brand";
import { fetchBrands } from "@/lib/fetchBrands";
import { useAppContext } from "@/context/appContext";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { DateRange as TDateRange } from "react-day-picker";
import { getOptionLabel } from "../ads/AddAds";

type ValueType = "totalAmount" | "count" | "totalPoints";

interface Props {
  initialData: OrdersStatsResponse;
}


const OrdersChart = ({ initialData }: Props) => {
  const t = useTranslations("chart");
  const { token } = useAppContext();
  const [chartType, setChartType] = useState<ChartType>("date");
  const [dateType, setDateType] = useState<DateType>("monthly");
  const [dateRange, setDateRange] = useState<TDateRange | undefined>(undefined);
  const [data, setData] = useState<OrdersStatsResponse>(initialData);
  const [valueType, setValueType] = useState<ValueType>("totalAmount");
  const [selectedBrands, setSelectedBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);

  const dateTypeOptions = getDateTypeOptions(t);

  const valueTypeOptions = [
    { value: "totalAmount", label: t("totalAmount") },
    { value: "count", label: t("count") },
    { value: "totalPoints", label: t("totalPoints") },
  ];

  useEffect(() => {
    // Only fetch data if brands are selected
    if (selectedBrands.length === 0) {
      setData({}); // Clear data when no brands selected
      return;
    }

    const updateData = async () => {
      setLoading(true);
      try {
        const result = await fetchOrdersStats({
          byDates: chartType === "date",
          dateType: chartType === "date" ? dateType : undefined,
          from: dateRange?.from ?? undefined,
          to: dateRange?.to ?? undefined,
          brandIds: selectedBrands.map((b) => b.id),
        });

        if (result.error) {
          console.error("Error fetching order stats:", result.error);
          return;
        }

        if (result.data) {
          setData(result.data);
        }
      } catch (error) {
        console.error("Error fetching order stats:", error);
      } finally {
        setLoading(false);
      }
    };

    updateData();
  }, [chartType, dateType, dateRange, selectedBrands]);

  const ordersStats = data.brandStats ?? [];
  const timeSeriesData = data.timeSeriesData ?? [];

  return (
    <div className="bg-white flex-col flex gap-5 px-5 sm:px-10 py-6 rounded-3xl shadow-md ">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-3 flex-wrap">
        <h2 className="text-xl font-semibold">{t("orderStatistics")}</h2>

        <DateRange
          value={dateRange}
          onChange={(newValue) => setDateRange(newValue)}
          onSearch={() => {}}
        />

        <div className="flex items-center gap-2 flex-wrap">
          {chartTypes.map((type) => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              className={clsx(
                "px-4 py-2 rounded-md transition-colors",
                chartType === type
                  ? "bg-primary text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              )}
            >
              {t(type)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <FetchSelect<Brand>
            label={t("filterByBrands")}
            placeholder={t("selectBrands")}
            fetchFunction={(params) =>
              fetchBrands({ ...params, token, fields: "id,name,logo" })
            }
            getOptionLabel={getOptionLabel}
            getOptionValue={(brand) => brand.id}
            getOptionDisplayText={(brand) => brand.name}
            onChange={(brands) => setSelectedBrands(brands)}
            multiple={true}
            clearable={true}
            className="w-full"
          />

          {chartType === "date" && (
            <Select
              value={dateType}
              onValueChange={(value) => setDateType(value as DateType)}
              options={dateTypeOptions}
              className="w-full md:w-48"
            />
          )}

          <Select
            value={valueType}
            onValueChange={(value) => setValueType(value as ValueType)}
            options={valueTypeOptions}
            className="w-full md:w-48"
          />
        </div>
      </div>

      <div className="h-[400px] w-full rounded-3xl shadow-lg p-4">
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full size-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        {!loading && selectedBrands.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">{t("selectBrandsToViewData")}</p>
          </div>
        )}
        {!loading &&
        (data.brandStats ?? data.timeSeriesData ?? []).length > 0 ? (
          <>
            {chartType === "date" && (
              <DateChart
                data={timeSeriesData}
                itemKey="brands"
                valueLabel={valueType}
              />
            )}
            {chartType === "bar" && (
              <BarChartComponent data={ordersStats} valueLabel={valueType} />
            )}
            {chartType === "pie" && (
              <PieChartComponent data={ordersStats} valueLabel={valueType} />
            )}
          </>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">{t("noDataAvailable")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersChart;
