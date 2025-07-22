"use client";

import { useInsights } from "@/hooks/useInsights";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/registry/new-york-v4/ui/card";
import { Badge } from "@/registry/new-york-v4/ui/badge";
import { Skeleton } from "@/registry/new-york-v4/ui/skeleton";
import { ScrollArea } from "@/registry/new-york-v4/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/new-york-v4/ui/dialog";
import { Button } from "@/registry/new-york-v4/ui/button";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

export default function VerticalInsightsCarousel() {
  const { insights, isLoading, error } = useInsights();
  const [selectedInsight, setSelectedInsight] = useState<
    null | (typeof insights)[number]
  >(null);

  if (isLoading) {
    return (
      <div className="h-[500px]">
        <ScrollArea className="h-full pr-2">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton key={idx} className="h-36 mb-4 w-full rounded-xl" />
          ))}
        </ScrollArea>
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500 py-4">Failed to load insights.</p>
    );
  }

  if (insights.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-4">
        No insights available yet.
      </p>
    );
  }

  return (
    <div className="rounded-xl bg-gradient-to-r bg-[linear-gradient(to_bottom,rgba(0,0,0,0.6)_20%,rgba(38,38,38,0.2)_80%,rgba(255,255,255,0.05)_100%)] border border-grey-200 p-6">
      <h2 className="text-white text-2xl font-semibold mb-6">
        Recent Insights
      </h2>
      <div className="h-[450px]">
        <ScrollArea className="h-full pr-2">
          <div className="flex flex-col gap-4">
            {insights.map((insight) => (
              <Card key={insight.id} className="min-h-[140px]">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">
                      {insight.sessions?.track_name ?? "Unknown Track"}
                    </CardTitle>
                    <Badge
                      variant={insight.viewed ? "outline" : "default"}
                      className={insight.viewed ? "text-muted-foreground" : ""}
                    >
                      {insight.viewed ? "Viewed" : "New"}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs mt-1">
                    {insight.created_at
                      ? formatDistanceToNow(new Date(insight.created_at), {
                          addSuffix: true,
                        })
                      : "Unknown time"}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-5">
                    {insight.report}
                  </p>
                </CardContent>

                <CardFooter className="text-xs text-muted-foreground pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="link"
                        className="text-xs h-auto p-0"
                        onClick={() => setSelectedInsight(insight)}
                      >
                        View Full Report (ID: {insight.session_id?.slice(0, 8)})
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle>
                          {insight.sessions?.track_name ?? "Session Insight"}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="mt-2 max-h-[400px] overflow-y-auto text-sm whitespace-pre-wrap">
                        <p>{insight.report}</p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
