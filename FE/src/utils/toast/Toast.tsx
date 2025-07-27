"use client";

import { notification } from "antd";
import { useEffect } from "react";
import { ToastMessage } from "./useToast";

export type ToastStyle = {
  duration?: number;
  placement?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
};

export type ToastProps = {
  message: ToastMessage;
  onExited: () => void;
} & ToastStyle;

export const Toast = ({
  message,
  onExited,
  duration = 4.5,
  placement = "topRight",
}: ToastProps) => {
  useEffect(() => {
    notification.open({
      message: null, // no title
      description: message.message,
      type: message.severity as "success" | "error" | "info" | "warning",
      duration,
      placement,
      onClose: onExited,
    });
  }, [message, duration, placement, onExited]);

  return null; // No visual component needed
};
