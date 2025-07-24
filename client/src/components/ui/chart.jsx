import React, { createContext, useContext, useId, useMemo, useEffect, forwardRef } from "react";
import {
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend
} from "recharts";
import { cn } from "@/lib/utils";

const THEMES = { light: "", dark: ".dark" };

const ChartContext = createContext(null);

function useChart() {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}

const ChartContainer = forwardRef(function ChartContainer(
  { id, className, children, config, ...props },
  ref
) {
  const uniqueId = useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <ResponsiveContainer>{children}</ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});

function ChartStyle({ id, config }) {
  const colorConfig = Object.entries(config).filter(
    ([, cfg]) => cfg.theme || cfg.color
  );

  if (!colorConfig.length) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, cfg]) => {
    const color = cfg.theme?.[theme] || cfg.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join("\n")}
}`)
          .join("\n")
      }}
    />
  );
}

const ChartTooltip = RechartsTooltip;

const ChartTooltipContent = forwardRef(function ChartTooltipContent(
  {
    active,
    payload,
    className,
    indicator = "dot",
    hideLabel = false,
    hideIndicator = false,
    label,
    labelFormatter,
    labelClassName,
    formatter,
    color,
    nameKey,
    labelKey,
  },
  ref
) {
  const { config } = useChart();

  const tooltipLabel = useMemo(() => {
    if (hideLabel || !payload?.length) return null;
    const [item] = payload;
    const key = labelKey || item.dataKey || item.name || "value";
    const itemCfg = getPayloadConfig(config, item, key);
    const value = !labelKey && typeof label === "string" ? config[label]?.label || label : itemCfg?.label;

    if (labelFormatter) {
      return <div className={cn("font-medium", labelClassName)}>{labelFormatter(value, payload)}</div>;
    }
    return value ? <div className={cn("font-medium", labelClassName)}>{value}</div> : null;
  }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);

  if (!active || !payload?.length) return null;

  const nestLabel = payload.length === 1 && indicator !== "dot";

  return (
    <div
      ref={ref}
      className={cn(
        "grid min-w-[8rem] gap-1.5 rounded-lg border bg-background px-2.5 py-1.5 text-xs shadow-xl",
        className
      )}
    >
      {!nestLabel && tooltipLabel}
      <div className="grid gap-1.5">
        {payload.map((item, idx) => {
          const key = nameKey || item.name || item.dataKey || "value";
          const cfg = getPayloadConfig(config, item, key);
          const indColor = color || item.payload.fill || item.color;

          return (
            <div
              key={item.dataKey}
              className={cn("flex w-full gap-2", indicator === "dot" && "items-center")}
            >
              {!hideIndicator && (
                <div
                  className={cn("shrink-0 rounded border bg", {
                    "h-2.5 w-2.5": indicator === "dot",
                    "w-1": indicator === "line",
                    "w-0 border border-dashed bg-transparent": indicator === "dashed",
                  })}
                  style={{ backgroundColor: indColor, borderColor: indColor }}
                />
              )}
              <div className="flex flex-1 justify-between">
                <div className="grid">
                  {nestLabel && tooltipLabel}
                  <span>{cfg?.label || item.name}</span>
                </div>
                <span className="font-mono font-medium tabular-nums">
                  {item.value?.toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

const ChartLegend = RechartsLegend;

const ChartLegendContent = forwardRef(function ChartLegendContent(
  { className, hideIcon = false, payload, verticalAlign = "bottom", nameKey },
  ref
) {
  const { config } = useChart();

  if (!payload?.length) return null;

  return (
    <div
      ref={ref}
      className={cn("flex items-center justify-center gap-4", verticalAlign === "top" ? "pb-3" : "pt-3", className)}
    >
      {payload.map((item) => {
        const key = nameKey || item.dataKey || "value";
        const cfg = getPayloadConfig(config, item, key);
        return (
          <div key={item.value} className="flex items-center gap-1.5">
            {!hideIcon ? (
              <div
                className="h-2 w-2 rounded"
                style={{ backgroundColor: item.color }}
              />
            ) : null}
            {cfg?.label}
          </div>
        );
      })}
    </div>
  );
});

function getPayloadConfig(config, payload, key) {
  if (typeof payload !== "object" || payload === null) return;
  const p = payload.payload ?? {};
  const labelKey =
    typeof payload[key] === "string"
      ? payload[key]
      : typeof p[key] === "string"
      ? p[key]
      : key;
  return config[labelKey] || config[key];
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle
};
