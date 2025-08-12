"use client";
import { Order, OrderStatus } from "@/app/[locale]/orders/OrdersData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import Image from "next/image";

const OrderDetails = ({
  open,
  setOpen,
  order,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  order: Order;
}) => {
  const t = useTranslations("orders");
  // Helper for status color
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-400 text-white";
      case "CONFIRMED":
      case "DELIVERED":
        return "bg-green-500 text-white";
      case "SHIPPED":
        return "bg-blue-500 text-white";
      case "PROCESSING":
        return "bg-orange-500 text-white";
      case "CANCELLED":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-300 text-black";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[95vw] sm:max-w-xl md:max-w-2xl lg:max-w-3xl rounded-3xl bg-[#f0f2f5] p-0">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center pt-6 pb-2">
            {t("orderDetails")}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="rounded-xl overflow-x-auto sidebar-scrolling px-4 pb-6">
          <table className="w-full text-base text-center text-gray-700 bg-white rounded-2xl overflow-hidden shadow">
            <thead className="text-base font-bold bg-[#dfe2e8]">
              <tr>
                <th className="px-4 py-3 whitespace-nowrap">{t("image")}</th>
                <th className="px-4 py-3 whitespace-nowrap">{t("name")}</th>
                <th className="px-4 py-3 whitespace-nowrap">{t("cost")}</th>
                <th className="px-4 py-3 whitespace-nowrap">
                  {t("afterOffered")}
                </th>
                <th className="px-4 py-3 whitespace-nowrap">{t("quantity")}</th>
                <th className="px-4 py-3 whitespace-nowrap">{t("status")}</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {order.items?.map((item, idx) => {
                const stringifyImages = `${item?.product?.images ?? ""}`;
                const parseImages = item?.product?.images
                  ? JSON.parse(stringifyImages)
                  : [];

                return (
                  <tr
                    key={item?.id || idx}
                    className={idx % 2 === 0 ? "bg-white" : "bg-[#f9f6ff]"}
                  >
                    <td className="px-4 py-3">
                      <div className="flex justify-center items-center">
                        <Image
                          src={parseImages?.[0] || "/imgs/notfound.png"}
                          alt={item?.product?.name || "-"}
                          width={48}
                          height={48}
                          className="rounded-full object-cover w-16 h-16 border border-gray-200"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold">
                      {item?.product?.nameAr || item?.product?.name || "-"}
                    </td>
                    <td className="px-4 py-3">{item?.price ?? "-"}</td>
                    <td className="px-4 py-3">
                      {item?.product?.offer ?? item?.product?.price ?? "-"}
                    </td>
                    <td className="px-4 py-3">{item.quantity ?? 1}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-4 py-2 rounded-lg font-bold ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {t(order.status)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-[#f0f2f5]">
                <td
                  colSpan={5}
                  className="text-right px-4 py-4 font-bold text-xl"
                >
                  {t("total")}
                </td>
                <td className="px-4 py-4 font-bold text-2xl text-black">
                  {order.totalAmount ?? 0}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetails;
