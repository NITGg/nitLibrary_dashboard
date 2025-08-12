import axios from "axios";

export const fetchBrands = async ({
  search,
  skip,
  limit,
  token,
  notIn,
  fields,
}: {
  search: string;
  skip: number;
  limit: number;
  token: string;
  notIn?: string[];
  fields?: string;
}) => {
  try {
    const today = new Date().toISOString();
    const queryParams = new URLSearchParams({
      keyword: search,
      limit: String(limit),
      skip: String(skip),
      sort: "name",
      "validTo[gte]": today,
      "validFrom[lte]": today,
    });
    if (fields) {
      queryParams.append("fields", fields);
    }
    if (notIn) {
      queryParams.append("id[notIn]", JSON.stringify(notIn));
    }

    const { data } = await axios.get(`/api/brand?${queryParams}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      data: data.brands,
      totalPages: data.totalPages,
    };
  } catch (error) {
    console.error("Error fetching badges:", error);
    return { data: [], totalPages: 0 };
  }
};
