"use client";
import Image, { ImageProps } from "next/image";
import React, { useState } from "react";

const ImageApi = (props?: ImageProps) => {
  const [imgSrc, setImgSrc] = useState(
    props?.src ? `${props.src}` : "/imgs/notfound.png"
  );

  const handleError = () => {
    setImgSrc("/imgs/notfound.png");
  };
  const pro = { ...props };
  delete pro.src;
  delete pro.alt;
  delete pro.onError;
  return (
    imgSrc != undefined && (
      <Image
        src={imgSrc || "/imgs/notfound.png"}
        alt={props?.alt || "notfound"}
        onError={handleError}
        {...pro}
      />
    )
  );
};

export default ImageApi;
