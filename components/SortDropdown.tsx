"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import {
  ArrowDown,
  ArrowDownWideNarrow,
  ArrowUp,
  ArrowUpDown,
} from "lucide-react";
import usePushQuery from "@/hooks/usePushQuery";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

const SortDropdown = ({
  //   className,
  options,
}: {
  //   className?: string;
  options: { label: string; value: string }[];
}) => {
  const t = useTranslations("Tablecomponent");
  const pushQuery = usePushQuery();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") ?? "";
  const currentOrder = currentSort.startsWith("-") ? "desc" : "asc";
  const currentSortField = currentSort.replace("-", "");

  const handleSort = (key: string) => {
    if (!key) return;

    if (currentSortField === key) {
      if (currentOrder === "asc") {
        pushQuery("sort", `-${key}`);
      } else {
        pushQuery("sort", "");
      }
    } else {
      pushQuery("sort", key);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-2 bg-gray-200 rounded-md text-gray-700 font-medium hover:bg-primary/10">
          {t("sort")}
          <ArrowDownWideNarrow className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleSort(option.value)}
            className={
              currentSort === option.value ? "bg-primary/10 font-bold" : ""
            }
          >
            {option.label}
            {currentSortField === option.value &&
              (currentOrder === "asc" ? (
                <ArrowUp className="size-3.5 text-primary font-bold transition" />
              ) : (
                <ArrowDown className="size-3.5 text-primary font-bold transition" />
              ))}
            {currentSortField !== option.value && (
              <ArrowUpDown className="size-3.5 text-gray-400 transition" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortDropdown;
