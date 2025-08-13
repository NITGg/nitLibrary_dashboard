import Products from "@/components/products/Products";
import { Category } from "../categories/categoriesData";
import { OrderItem } from "../orders/OrdersData";
import { SearchParams } from "@/types/common";

export interface Product {
  id: number;
  name: string;
  nameAr?: string;
  description?: string;
  descriptionAr?: string;
  images?: string[];
  price: number;
  costPrice?: number;
  offer: number;
  stock: number;
  minStock?: number;
  sku: string;
  barcode?: string;
  weight?: number;
  dimensions?: string;
  isActive: boolean;
  category?: Partial<Category>;
  createdAt: string;
  updatedAt?: string;
  categoryId: number;
  isFeatured: boolean;
  supplierId?: number;
  supplier?: any;
  orderItems?: OrderItem[];
  cartItems?: any[];
  reviews?: any[];
  wishlist?: any[];
  bookDetails?: any;
}

interface ProductApiResponse {
  products: Product[];
  totalProducts: number;
  totalPages: number;
}

export const fetchProducts = async (
  searchParams: SearchParams,
  locale: string,
  categoryName?: string
): Promise<{
  data: ProductApiResponse | null;
  error: string | null;
}> => {
  try {
    let queryParams = new URLSearchParams({
      limit:
        (categoryName
          ? searchParams.limitArchive?.toString()
          : searchParams.limit?.toString()) ?? "10",
      sort:
        (categoryName
          ? searchParams.sortArchive?.toString()
          : searchParams.sort?.toString()) ?? "-createdAt",
      fields:
        "id,name,nameAr,description,descriptionAr,images,price,stock,createdAt,isActive,isFeatured,offer,category=id-name-nameAr",
    });
    // "id,name,nameAr,description,price,costPrice,stock,minStock,sku,barcode,images,weight,dimensions,isActive,isFeatured,categoryId,supplierId,createdAt,updatedAt,category,supplier,orderItems,cartItems,reviews,wishlist,bookDetails"

    if (searchParams.skip && !categoryName)
      queryParams.append("skip", searchParams.skip.toString());
    if (searchParams.keyword && !categoryName)
      queryParams.append("keyword", searchParams.keyword.toString());
    if (categoryName)
      queryParams.append(
        "category[name]",
        decodeURIComponent(categoryName.trim())
      );
    if (searchParams.skipArchive && categoryName)
      queryParams.append("skip", searchParams.skipArchive.toString());
    if (searchParams.keywordArchive && categoryName)
      queryParams.append("keyword", searchParams.keywordArchive.toString());
    if (searchParams.isFeatured)
      queryParams.append("isFeatured", searchParams.isFeatured.toString());
    if (searchParams.isActive)
      queryParams.append("isActive", searchParams.isActive.toString());

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products?${queryParams}`,
      {
        method: "GET",
        credentials: "include",
        // cache: "no-cache",
        cache: "force-cache", // or "default"
        next: { tags: [`${JSON.stringify(searchParams)}`] }, // enables cache per searchParams
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

const ProductsData = async ({
  searchParams,
  locale,
  categoryName,
}: {
  searchParams: SearchParams;
  locale: string;
  categoryName?: string;
}) => {
  const { data, error } = await fetchProducts(
    searchParams,
    locale,
    categoryName
  );

  if (error) return <div className="text-red-500">Error: {error}</div>;
  return (
    <Products
      products={data?.products ?? []}
      count={data?.totalProducts ?? 0}
      totalPages={data?.totalPages ?? 0}
      categoryName={categoryName}
    />
  );
};

export default ProductsData;
