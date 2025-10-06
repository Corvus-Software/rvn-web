import React, { useEffect, useState } from "react";
import { useSessionTrends } from "@/hooks/useTrends";
import { useSessions } from "@/hooks/useSessions";
import { Badge } from "@/registry/new-york-v4/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

export function SectionCards() {
  const { trends, loading, error, fetchTrends } = useSessionTrends();
  const { sessions } = useSessions();
  const [trackName, setTrackName] = useState("Track Unknown");

  useEffect(() => {
    fetchTrends();
  }, []);

  useEffect(() => {
    if (!trends || !sessions || sessions.length === 0) return;

    const trendTrackId = trends.track_id;
    if (trendTrackId) {
      const matchedSession = sessions.find(
        (session: { track_id: string; track_name?: string }) => session.track_id === trendTrackId
      );
      if (matchedSession && matchedSession.track_name) {
        setTrackName(matchedSession.track_name);
      } else {
        setTrackName("Track Unknown");
      }
    }
  }, [trends, sessions]);

  if (loading) return <p>Loading trends...</p>;
  if (error) return <p className="text-destructive">Error: {error}</p>;
  if (!trends) return <p>No trends found</p>;

  // Extract the nested metrics JSON
  const metrics = trends.trends;

  function findKeyEndingWith(suffix: string) {
    if (!metrics) return undefined;

    return Object.keys(metrics).find((key) => key.endsWith(suffix));
  }

  const maxLeanKey = findKeyEndingWith("max_lean_per_session");
  const avgLeanKey = findKeyEndingWith("avg_lean_per_session");
  const bestLapKey = findKeyEndingWith("best_lap_s_per_session");
  const lapStdKey = findKeyEndingWith("lap_time_std_per_session");

  const maxLeanDelta = maxLeanKey ? metrics[maxLeanKey] : 0;
  const avgLeanDelta = avgLeanKey ? metrics[avgLeanKey] : 0;
  const bestLapDelta = bestLapKey ? metrics[bestLapKey] : 0;
  const lapStdDelta = lapStdKey ? metrics[lapStdKey] : null;
  const bestLapDeltaSec = bestLapDelta !== undefined ? -bestLapDelta : 0;

  function formatDelta(value: number, unit = "") {
    const sign = value > 0 ? "+" : "";

    return `${sign}${value.toFixed(2)}${unit}`;
  }

  const cards = [
    {
      title: "Max Lean",
      delta: formatDelta(maxLeanDelta, "°"),
      feedback:
        maxLeanDelta > 0
          ? "Great job, you're getting more confident."
          : "Try to be more confident in your leans.",
      track: trackName,
      positive: maxLeanDelta > 0,
    },
    {
      title: "Average Lean",
      delta: formatDelta(avgLeanDelta, "°"),
      feedback:
        avgLeanDelta > 0
          ? "You're getting more consistent and confident."
          : "Work on lean consistency.",
      track: trackName,
      positive: avgLeanDelta > 0,
    },
    {
      title: "Fastest Lap Times",
      delta: formatDelta(bestLapDeltaSec, "s"),
      feedback:
        bestLapDeltaSec > 0
          ? "Great job, you're getting faster each session."
          : "Your lap times are slower. Keep pushing!",
      track: trackName,
      positive: bestLapDeltaSec > 0,
    },
    {
      title: "Lap Time Std",
      delta: lapStdDelta !== null ? formatDelta(lapStdDelta) : "N/A",
      feedback:
        "Your lap times are not consistent. Look at insights for ways to improve.",
      track: trackName,
      positive: lapStdDelta !== null && lapStdDelta < 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-4">
      {cards.map(({ title, delta, feedback, track, positive }) => {
        const Icon = positive ? IconTrendingUp : IconTrendingDown;
        const colorClass = positive
          ? "text-green-foreground"
          : "text-destructive";

        return (
          <Card key={title} className="p-4 rounded-2xl shadow">
            <CardHeader>
              <CardDescription>{title}</CardDescription>
              <CardTitle className={`text-2xl font-semibold`}>
                {delta}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">{track}</Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className={`flex items-center gap-1 font-medium`}>
                {delta !== "N/A" && <Icon size={18} />}
                {feedback}
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
