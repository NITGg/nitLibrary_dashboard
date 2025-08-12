"use client";
import { RoleStatsResponse } from "@/app/[locale]/users/RolesData";
import { fetchRoleStats } from "@/app/actions/users/chartActions";
import BarChartComponent from "@/components/charts/BarChart";
import DateChart from "@/components/charts/DateChart";
import PieChartComponent from "@/components/charts/PieChart";
import DateRange from "@/components/DateRange";
import { Select } from "@/components/ui/select";
import usePushQuery from "@/hooks/usePushQuery";
import { chartTypes, getDateTypeOptions } from "@/lib/charts";
import { ChartType, DateType } from "@/types/charts";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { DateRange as TDateRange } from "react-day-picker";

interface Props {
  initialData: RoleStatsResponse;
}

const RolesChart = ({ initialData }: Props) => {
  const t = useTranslations("chart");
  const pushQuery = usePushQuery();
  const [chartType, setChartType] = useState<ChartType>("date");
  const [dateType, setDateType] = useState<DateType>("monthly");
  const [dateRange, setDateRange] = useState<TDateRange | undefined>(undefined);
  const [data, setData] = useState<RoleStatsResponse>(initialData);
  const [loading, setLoading] = useState(false);

  const dateTypeOptions = getDateTypeOptions(t);

  useEffect(() => {
    const updateData = async () => {
      setLoading(true);
      try {
        const result = await fetchRoleStats({
          byDates: chartType === "date",
          dateType: chartType === "date" ? dateType : undefined,
          from: dateRange?.from ?? undefined,
          to: dateRange?.to ?? undefined,
        });

        if (result.error) {
          console.error("Error fetching badge stats:", result.error);
          return;
        }

        if (result.data) {
          setData(result.data);
        }
      } catch (error) {
        console.error("Error fetching badge stats:", error);
      } finally {
        setLoading(false);
      }
    };

    updateData();
  }, [chartType, dateType, dateRange]);

  const handleChartClick = (data: { name?: string }) => {
    if (data?.name) {
      pushQuery("some_userRole", `role=name=${data.name}`, true);
    }
  };
  const rolesStats = data.roleStats ?? [];
  const timeSeriesData = data.timeSeriesData ?? [];

  return (
    <div className="bg-white flex-col flex gap-5 px-5 sm:px-10 py-6 rounded-3xl shadow-md">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-3 flex-wrap">
        <h2 className="text-xl font-semibold">{t("roleStatistics")}</h2>
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
        {chartType === "date" && (
          <Select
            value={dateType}
            onValueChange={(value) => setDateType(value as DateType)}
            options={dateTypeOptions}
            className="w-full md:w-48"
          />
        )}
      </div>

      <div className="h-[400px] w-full rounded-3xl shadow-lg p-4">
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full size-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        {!loading &&
        (data.roleStats ?? data.timeSeriesData ?? []).length > 0 ? (
          <>
            {chartType === "date" && (
              <DateChart
                data={timeSeriesData}
                itemKey="roles"
                onItemClick={handleChartClick}
              />
            )}
            {chartType === "bar" && (
              <BarChartComponent
                data={rolesStats}
                valueLabel="count"
                onItemClick={handleChartClick}
              />
            )}
            {chartType === "pie" && (
              <PieChartComponent
                data={rolesStats}
                valueLabel="count"
                onItemClick={handleChartClick}
              />
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

export default RolesChart;
