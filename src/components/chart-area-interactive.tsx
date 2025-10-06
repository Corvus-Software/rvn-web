"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/registry/new-york-v4/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/new-york-v4/ui/toggle-group";

export const description = "An interactive area chart";

// Original sessions data
const sessions = [
  {
    location: "VIR North Paddock",
    date: "08/03/2024",
    time: "9:18 AM",
    fastestLap: "01:43.09",
    averageLap: "01:50.04",
    topSpeed: "151 mph",
    totalLaps: 3,
    maxLean: 84,
    avgLean: 56,
    trackTemp: "106.27°F",
  },
  {
    location: "Laguna Seca",
    date: "08/10/2024",
    time: "10:02 AM",
    fastestLap: "01:39.88",
    averageLap: "01:45.12",
    topSpeed: "147 mph",
    totalLaps: 4,
    maxLean: 81,
    avgLean: 54,
    trackTemp: "102.13°F",
  },
  {
    location: "Willow Springs",
    date: "08/17/2024",
    time: "8:45 AM",
    fastestLap: "01:44.32",
    averageLap: "01:48.90",
    topSpeed: "149 mph",
    totalLaps: 5,
    maxLean: 86,
    avgLean: 57,
    trackTemp: "108.75°F",
  },
  {
    location: "Buttonwillow Raceway",
    date: "08/24/2024",
    time: "9:30 AM",
    fastestLap: "01:46.71",
    averageLap: "01:52.03",
    topSpeed: "145 mph",
    totalLaps: 4,
    maxLean: 82,
    avgLean: 55,
    trackTemp: "104.63°F",
  },
  {
    location: "Road Atlanta",
    date: "08/31/2024",
    time: "10:15 AM",
    fastestLap: "01:41.67",
    averageLap: "01:47.12",
    topSpeed: "153 mph",
    totalLaps: 3,
    maxLean: 87,
    avgLean: 58,
    trackTemp: "110.10°F",
  },
  {
    location: "COTA",
    date: "09/07/2024",
    time: "9:05 AM",
    fastestLap: "01:40.01",
    averageLap: "01:44.78",
    topSpeed: "150 mph",
    totalLaps: 6,
    maxLean: 85,
    avgLean: 59,
    trackTemp: "109.44°F",
  },
  {
    location: "Sebring",
    date: "09/14/2024",
    time: "8:50 AM",
    fastestLap: "01:42.56",
    averageLap: "01:46.97",
    topSpeed: "152 mph",
    totalLaps: 4,
    maxLean: 83,
    avgLean: 56,
    trackTemp: "107.20°F",
  },
];

// Convert "mm:ss.SS" to seconds (number)
function timeToSeconds(timeStr: string): number {
  const [min, sec] = timeStr.split(":");

  return Number(min) * 60 + Number(sec);
}

const chartData = sessions.map((session) => ({
  date: new Date(session.date).toISOString().split("T")[0], // "YYYY-MM-DD"
  desktop: timeToSeconds(session.fastestLap),
  mobile: timeToSeconds(session.averageLap),
}));

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Fastest Lap (sec)",
    color: "var(--primary)",
  },
  mobile: {
    label: "Average Lap (sec)",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-09-14"); // latest session date
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return date >= startDate;
  });

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Lap Times</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Lap times for sessions
          </span>
          <span className="@[540px]/card:hidden">Lap times</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 2}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
