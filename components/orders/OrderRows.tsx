"use client";
import { useTranslations } from "next-intl";
import { DateToText } from "@/lib/DateToText";
import { Link } from "@/i18n/routing";
import Table, { TableHeader } from "@/components/ui/Table";
import Pagination from "../ui/Pagination";
import DownloadButton from "../ui/DownloadButton";
import ImageApi from "../ImageApi";
import OrderDetails from "../users/id/userOrders/OrderDetails";
import { EyeIcon } from "../icons";
import { useState } from "react";
import { Order } from "@/app/[locale]/orders/OrdersData";

const OrderRows = ({
  orders,
  count,
  totalPages,
}: {
  orders: Order[];
  count: number;
  totalPages: number;
}) => {
  const t = useTranslations("orders");
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);

  const headers: TableHeader[] = [
    { name: "id", className: "px-3 py-2", sortable: true, key: "id" },
    {
      name: "users",
      className: "px-3 py-2",
      sortable: true,
      key: "customer.fullname",
    },
    {
      name: "totalAmount",
      className: "px-3 py-2",
      sortable: true,
      key: "totalAmount",
    },
    { name: "items", className: "px-3 py-2" },
    {
      name: "createdAt",
      className: "px-3 py-2",
      sortable: true,
      key: "createdAt",
    },
    { name: "action", className: "flex justify-center items-center" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h4 className="font-bold text-lg md:text-xl lg:text-2xl">
            {t("orders")}
          </h4>
        </div>
      </div>
      <Table
        headers={headers}
        pagination={
          <Pagination
            count={count}
            totalPages={totalPages}
            downloadButton={
              <DownloadButton<
                Order & {
                  "customer=fullname-phone": string;
                  "customer.fullname": string;
                }
              >
                model="order"
                fields={[
                  "id",
                  "customer=fullname-phone",
                  "totalAmount",
                  "status",
                  "paymentStatus",
                  "createdAt",
                ]}
                items={["customer.fullname"]}
              />
            }
          />
        }
      >
        {!orders.length && (
          <tr className="odd:bg-white even:bg-primary/5 border-b">
            <td
              colSpan={headers.length}
              scope="row"
              className="px-3 py-2 text-center font-bold"
            >
              {t("no data yet")}
            </td>
          </tr>
        )}
        {orders?.map((order) => (
          <tr
            key={order.id}
            className="odd:bg-white even:bg-[#F0F2F5] border-b"
          >
            <td className="px-3 py-2 whitespace-nowrap">{order.orderNumber}</td>
            <td className="px-3 py-2">
              <div className="flex items-center gap-2">
                <div className="size-12">
                  <ImageApi
                    src={order?.customer?.imageUrl ?? "/imgs/notfound.png"}
                    alt="User Avatar"
                    className="size-full rounded-full object-cover border-2"
                    width={200}
                    height={200}
                  />
                </div>
                <Link
                  href={`/users/${order?.customer?.id}`}
                  className="whitespace-nowrap font-medium text-primary hover:text-primary/80 transition-colors duration-200 hover:underline"
                >
                  {order?.customer?.fullname}
                </Link>
              </div>
            </td>
            <td className="px-3 py-2 whitespace-nowrap">
              {t("totalPrice", { price: order.totalAmount })}
            </td>
            <td className="px-3 py-2 whitespace-nowrap">{order?.items?.length ?? 0}</td>
            <td className="px-3 py-2 whitespace-nowrap">
              {DateToText(order.createdAt)}
            </td>
            <td className="px-3 py-2 whitespace-nowrap">
              <button
                onClick={() => setOrderDetails(order)}
                type="button"
                className="text-primary hover:text-gray-700 transition-colors flex justify-center items-center size-full"
              >
                <EyeIcon className="size-5" />
              </button>
            </td>
          </tr>
        ))}

      </Table>
      {orderDetails && (
        <OrderDetails
          order={orderDetails}
          open={!!orderDetails}
          setOpen={() => {
            setOrderDetails(null);
          }}
        />
      )}
    </div>
  );
};

export default OrderRows;
