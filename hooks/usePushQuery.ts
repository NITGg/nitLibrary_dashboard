"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";

const usePushQuery = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pushQuery = (key: string, term: string, scroll: boolean = false) => {
    const params = new URLSearchParams(searchParams.toString());

    if (key === "clear") return router.replace(`${pathname}`, { scroll });

    if (term) {
      params.set(key, term);
    } else {
      params.delete(key);
    }

    if (key !== "skip") {
      params.set("skip", "0");
    }

    const url = `${pathname}?${params.toString()}`;
    router.replace(url, { scroll });
  };

  return pushQuery;
};

export default usePushQuery;
