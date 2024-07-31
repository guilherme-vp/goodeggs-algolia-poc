"use client";

import { InputHTMLAttributes } from "react";

export interface SearchBarProps {
  title?: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
}

export default function SearchBar({ inputProps, title }: SearchBarProps) {
  return (
    <div className="max-w-md mt-5 self-start">
      {title != null && (
        <p className="text-2xl font-bold leading-tight text-gray-900">
          {title}
        </p>
      )}
      <div className="relative flex">
        <input
          type="search"
          id="search"
          className="relative m-0 -me-0.5 block flex-auto rounded-s border border-solid border-neutral-200 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-surface outline-none transition duration-200 ease-in-out placeholder:text-neutral-500 focus:z-[3] focus:border-primary focus:shadow-inset focus:outline-none motion-reduce:transition-none"
          placeholder="Search"
          {...inputProps}
        />
      </div>
    </div>
  );
}
