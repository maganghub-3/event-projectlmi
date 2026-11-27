"use client";

import * as React from "react";
import { Legend, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

const ChartContainer = React.forwardRef(function ChartContainer(
  { className, children, height = 280, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn("w-full", className)}
      style={{ height }}
      {...props}
    >
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
});

function ChartTooltipContent({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-xl">
      <p className="mb-1.5 text-[11px] font-bold text-slate-500">{label}</p>
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div
            key={`${entry.dataKey ?? "item"}-${index}`}
            className="flex items-center justify-between gap-6 text-xs"
          >
            <span className="flex items-center gap-1.5 text-slate-600">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color || entry.stroke }}
              />
              {entry.name}
            </span>
            <span className="font-bold text-slate-900">
              {formatter ? formatter(entry.value, entry) : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartTooltip({ formatter, ...props }) {
  return (
    <Tooltip
      cursor={{ stroke: "#cbd5e1", strokeDasharray: "4 4" }}
      content={<ChartTooltipContent formatter={formatter} />}
      {...props}
    />
  );
}

const ChartLegend = Legend;

export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend };
