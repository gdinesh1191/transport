"use client";
import React, { forwardRef, JSX, useImperativeHandle, useState } from "react";

type AlertType = "warning" | "success" | "error";

export interface SweetAlertHandler {
  showAlert: (
    type: AlertType,
    title: string,
    message: string,
    onConfirm?: () => void,
    onCancel?: () => void
  ) => void;
  hideAlert: () => void;
}

const SweetAlert = forwardRef<SweetAlertHandler>((_, ref) => {
  const [show, setShow] = useState(false);
  const [type, setType] = useState<AlertType>("warning");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [onConfirm, setOnConfirm] = useState<() => void>(() => () => {});
  const [onCancel, setOnCancel] = useState<() => void>(() => () => {});

  useImperativeHandle(ref, () => ({
    showAlert: (type, title, message, onConfirmCb, onCancelCb) => {
      setType(type);
      setTitle(title);
      setMessage(message);
      setOnConfirm(() => () => {
        onConfirmCb?.();
      });
      setOnCancel(() => () => {
        onCancelCb?.();
      });
      setShow(true);
    },
    hideAlert: () => setShow(false),
  }));

  if (!show) return null;

  const ICONS: Record<AlertType, JSX.Element> = {
    warning: (
      <div className="w-14 h-14 mx-auto mb-2 rounded-full border-4 border-[#efbe94]  flex items-center justify-center">
        <div className="text-[#efbe94] text-3xl font-bold">!</div>
      </div>
    ),
    success: (
      <div className="w-14 h-14 mx-auto mb-2 rounded-full border-4 border-green-200 bg-green-50 flex items-center justify-center">
        <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    ),
    error: (
      <div className="w-14 h-14 mx-auto mb-2 rounded-full border-4 border-red-200 bg-red-50 flex items-center justify-center">
        <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    ),
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg text-center max-w-sm w-full mx-4">

        {/* Icon */}
        <div className="mb-2">{ICONS[type]}</div>

        {/* Title */}
        <div className="mb-4 text-2xl font-semibold">{title}</div>

        {/* Message */}
        <p className="text-gray-600 mb-6 text-sm">{message}</p>

        {/* Buttons */}
        <div className="flex justify-center gap-3">
          {type === "warning" ? (
            <>
              <button
                onClick={onCancel}
                className="btn-sm bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                No, Cancel!
              </button>
              <button
                onClick={onConfirm}
                className="btn-sm btn-primary"
              >
                Yes, Delete it!
              </button>
            </>
          ) : (
            <button
              onClick={onConfirm}
              className="btn-sm btn-primary"
            >
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

export default SweetAlert;
