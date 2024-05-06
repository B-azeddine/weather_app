import { cn } from "@/utils/cn";
import React from "react";

function Container(props: React.HTMLProps<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "flex w-full bg-white border rounded-xl py-4 shadow-sm",
        props.className
      )}
    />
  );
}

export default Container;
