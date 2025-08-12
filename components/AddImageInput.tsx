import React from "react";
import Image from "next/image";
import { Cross, Edit } from "lucide-react";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import clsx from "clsx";

interface AddImageInputProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  fieldForm: Path<T>;
  required?: boolean | string;
  text: string;
  imagePreview: string | null;
  setImagePreview: (value: string | null) => void;
}

const AddImageInput = <T extends FieldValues>({
  register,
  text,
  imagePreview,
  required = false,
  fieldForm ,
  setImagePreview,
}: AddImageInputProps<T>) => {
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      (event.currentTarget as HTMLLabelElement).click();
    }
  };
  return (
    <div
      className={clsx(
        "size-36 border-[#E9E9E9] rounded-md border",
        !imagePreview &&
          "hover:scale-95 focus-within:scale-95 transition-transform"
      )}
    >
      <input
        type="file"
        accept="image/*"
        id={fieldForm}
        {...register(fieldForm, {
          onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file) {
              setImagePreview(URL.createObjectURL(file));
            }
          },
          required,
        })}
        className="hidden"
      />
      {!imagePreview ? (
        <label
          htmlFor={fieldForm}
          className="flex flex-col gap-2 justify-center items-center cursor-pointer size-full"
          role="button"
          tabIndex={0}
          onKeyDown={handleKeyPress}
          aria-label={`Upload ${text}`}
        >
          <span className="size-10 bg-primary rounded-full grid place-content-center">
            <Cross color="white" fill="white" className="size-5" />
          </span>
          <span>{text}</span>
        </label>
      ) : (
        <div className="w-full h-full grid place-content-center relative">
          <Image
            src={imagePreview}
            alt="Uploaded Image"
            fill
            className="object-cover rounded-md"
          />
          <label
            htmlFor={fieldForm}
            className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md cursor-pointer hover:scale-95 transition-transform focus-within:scale-95"
            role="button"
            tabIndex={0}
            onKeyDown={handleKeyPress}
            aria-label={`Change ${text}`}
          >
            <Edit className="text-primary size-5 hover:text-primary/70 transition-colors" />
          </label>
        </div>
      )}
    </div>
  );
};

export default AddImageInput;
