"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppContext } from "@/context/appContext";
import axios from "axios";
import { Edit, Wallet } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import CustomSelect from "../CustomSelect";
import { useForm } from "react-hook-form";
import { LoadingIcon } from "@/components/icons";
import WalletHistoryDialog from "@/components/WalletHistoryDialog";
import { TypeUser } from "@/types/users";

const UserTypeAndPoints = ({ uid, type }: { uid: string; type: TypeUser }) => {
  const t = useTranslations("user");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { token } = useAppContext();
  const [editPoints, setEditPoints] = useState<boolean>(false);
  const [editType, setEditType] = useState<boolean>(false);
  const [walletHistoryDialog, setWalletHistoryDialog] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { userType, wallet, nextType } = type;
  const pointsLeft = nextType
    ? (nextType?.badge?.minAmount ?? nextType.buyAmount) - wallet.buyerAmount
    : 0;
  const locale = useLocale();

  const handelChangePoints = handleSubmit(async (formData) => {
    try {
      setLoading(true);
      const point = +formData.point;

      await axios.put(
        `/api/users/wallet/${uid}`,
        { point },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTimeout(() => window.location.reload(), 500);
      toast.success("Successfully Updated!!!");
      setEditPoints(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "There is an Error");
    } finally {
      setLoading(false);
    }
  });

  const onSubmit = handleSubmit(async (formData) => {
    try {
      setLoading(true);
      const buyerAmount = +formData.buyerAmount;

      await axios.put(
        `/api/users/wallet/${uid}`,
        { buyerAmount },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTimeout(() => window.location.reload(), 500);
      toast.success("Successfully Updated!!!");
      setEditType(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "There is an Error");
    } finally {
      setLoading(false);
    }
  });

  return (
    <>
      <h2 className="flex items-center text-2xl font-bold gap-3">
        {locale === "en"
          ? userType.userType + " " + t("user")
          : t("user") + " " + userType.userType}
        <button
          onClick={() => setEditType(true)}
          type="button"
          className="text-primary hidden"
        >
          <Edit className="size-4" />
        </button>
      </h2>
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-semibold">
          {t("userPurchases", {
            purchases: wallet.buyerAmount,
          })}
        </h3>
        <p>
          {nextType &&
            t("pointsDetails", {
              pointsLeft,
              nextType: nextType.userType,
            })}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <p>{t("walletHistory")}</p>
        <button type="button" onClick={() => setWalletHistoryDialog(true)}>
          <Wallet className="size-6" />
        </button>
      </div>
      <div className="flex items-center gap-2 h-12">
        <div className="w-7 h-full relative">
          <Image alt="pointsIcon" src={"/imgs/pointsIcon.svg"} fill />
        </div>
        {t("totalPoints")}: {wallet.point}
        <div className="items-center gap-2 hidden">
          <input
            type="number"
            className="text-black text-center w-14 block py-2 rounded-xl h-full shadow-[0px_0px_5px_-1px_#00000040]"
            defaultValue={wallet.point}
            min={0}
            onClick={() => setEditPoints(true)}
            {...register("point")}
          />
          <span>{t("points")}</span>

          {editPoints ? (
            <>
              <button
                onClick={handelChangePoints}
                type="button"
                className="bg-primary text-white px-4 py-2 rounded-2xl"
              >
                {loading ? (
                  <LoadingIcon className="w-6 h-6 animate-spin m-auto hover:stroke-white" />
                ) : (
                  t("save")
                )}
              </button>

              <button
                onClick={() => setEditPoints(false)}
                type="button"
                className="border-primary border-1 text-black px-4 py-2 rounded-2xl"
              >
                {t("cancel")}
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditPoints(true)}
              type="button"
              className="bg-primary text-white px-4 py-2 rounded-2xl"
            >
              {t("edit")}
            </button>
          )}
        </div>
      </div>
      <Dialog open={editType} onOpenChange={setEditType}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">
              {t("editUserType")}
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <form className="flex flex-col gap-1">
            <CustomSelect
              defaultValue={
                userType.userType === "Basic"
                  ? 0
                  : userType.userType === "Standard"
                  ? 2001
                  : 5001
              }
              errors={errors}
              register={register}
              label={t("userType")}
              fieldForm="buyerAmount"
              options={[
                { value: 0, label: t("basic") },
                { value: 2001, label: t("standard") },
                { value: 5001, label: t("vip") },
              ]}
              roles={{ required: false }}
            />
            <div className="flex gap-1 justify-center w-full mt-auto">
              <button
                type="button"
                onClick={onSubmit}
                className="py-2 w-1/2 rounded-2xl text-sm bg-primary text-white"
              >
                {loading ? (
                  <LoadingIcon className="w-6 h-6 animate-spin m-auto hover:stroke-white" />
                ) : (
                  t("updateType")
                )}
              </button>
              <button
                type="reset"
                onClick={() => setEditType(false)}
                className="py-2 w-1/2 rounded-2xl border-black border text-sm text-black"
              >
                {t("cancel")}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <WalletHistoryDialog
        open={walletHistoryDialog}
        onOpenChange={setWalletHistoryDialog}
        userId={uid}
      />
    </>
  );
};

export default UserTypeAndPoints;
