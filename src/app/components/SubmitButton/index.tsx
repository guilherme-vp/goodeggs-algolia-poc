"use client";

import { ButtonHTMLAttributes } from "react";
import { useFormStatus } from "react-dom";

export default function SubmitButton(
  props: ButtonHTMLAttributes<HTMLButtonElement>
) {
  const { pending: isLoading } = useFormStatus();

  return (
    <button
      className="mt-3 z-[2] inline-block rounded-e border-2 border-primary px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-primary"
      type="submit"
      disabled={isLoading}
      {...props}
    >
      Search
    </button>
  );
}
