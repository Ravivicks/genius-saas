"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("deb3d9b0-273d-49f0-958c-f4f57afadbd8");
  }, []);

  return null;
};
