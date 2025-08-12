import Categories from "@/components/category/Categories";
import { SearchParams } from "@/types/common";

export interface Category {
  id: number;
  name: string;
  nameAr: string;
  description?: string;
  imageUrl?: string;
  parentId?: number;
  parent?: Partial<Category>;
  children?: Partial<Category>;
  products?: Partial<Product[]>;
  createdAt: string;
  updatedAt?: string;
  isActive: boolean;
  _count?: {
    children?: number;
    products?: number;
  };
}
export interface Product {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  price: number;
  discountPrice?: number;
  brandId: number;
  categoryId: number;
}

interface CategoryApiResponse {
  categories: Category[];
  totalCount: number;
  totalPages: number;
  parentCategory?: {
    name: string;
    nameAr?: string;
    parent?: {
      name: string;
      nameAr?: string;
    };
  }; // Add parent category info
}

export const fetchCategories = async (
  searchParams: SearchParams,
  locale: string,
  parentName?: string
): Promise<{
  data: CategoryApiResponse | null;
  error: string | null;
}> => {
  try {
    const queryParams = new URLSearchParams({
      limit: searchParams.limit?.toString() ?? "10",
      sort: searchParams.sort?.toString() ?? "-createdAt",
      fields:
        "id,name,nameAr,description,imageUrl,parent=id-name,createdAt,isActive,_count=children-products",
    });

    if (searchParams.skip)
      queryParams.append("skip", searchParams.skip.toString());
    if (searchParams.keyword)
      queryParams.append("keyword", searchParams.keyword.toString());
    if (parentName)
      queryParams.append("parent[name]", decodeURIComponent(parentName.trim()));
    if (searchParams["createdAt[gte]"])
      queryParams.append(
        "createdAt[gte]",
        searchParams["createdAt[gte]"].toString()
      );
    if (searchParams["createdAt[lte]"])
      queryParams.append(
        "createdAt[lte]",
        searchParams["createdAt[lte]"].toString()
      );
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories?${queryParams}`,
      {
        method: "GET",
        credentials: "include",
        cache: "force-cache", // or "default"
        next: { tags: [`${JSON.stringify(searchParams)}`] },
        headers: {
          "accept-language": locale,
        },
      }
    );

    if (!res.ok) {
      return { data: null, error: await res.text() };
    }
    const data = await res.json();
    return { data, error: null };
  } catch (error: any) {
    console.error("Fetch error:", error);
    return { data: null, error: error?.message };
  }
};

const CategoriesData = async ({
  searchParams,
  locale,
  parentName,
  categoryPath,
}: {
  searchParams: SearchParams;
  locale: string;
  parentName?: string;
  categoryPath?: string[];
}) => {
  const { data, error } = await fetchCategories(
    searchParams,
    locale,
    parentName
  );

  if (error) return <div className="text-red-500">Error: {error}</div>;
  return (
    <Categories
      title={parentName ? "subCategories" : "categories"}
      categories={data?.categories ?? []}
      count={data?.totalCount ?? 0}
      totalPages={data?.totalPages ?? 0}
      parentName={parentName}
      categoryPath={categoryPath}
    />
  );
};

export default CategoriesData;
