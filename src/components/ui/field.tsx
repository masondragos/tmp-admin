import React, { ReactNode } from "react";

type Props = {
  label?: string;
  error?: string;
  isRequired?: boolean;
  children: ReactNode;
  errorSpace?: boolean;
};
const Field = ({
  label,
  errorSpace = true,
  isRequired = true,
  error,
  children,
}: Props) => {
  const isError = error?.length ? true : false;
  return (
    <div className="w-full">
      {label && <span className="block text-sm font-medium text-gray-700 mb-2">{`${label} ${isRequired ? "*" : ""}`}</span>}
      {children}
      {errorSpace ? (
        <p className="h-3 text-red-500 text-[11px] mt-[5px] ml-1 mb-1 flex items-center">
          {isError && error}
        </p>
      ) : (
        isError && (
          <p className="text-red-500 text-xs mt-1 ml-1 mb-1 flex items-center">
            {error}
          </p>
        )
      )}
    </div>
  );
};

export default Field;
