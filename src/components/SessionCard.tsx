import { Card, CardContent } from "@/registry/new-york-v4/ui/card";
import { Clock, MapPin } from "lucide-react";

type Session = {
  location: string;
  date: string;
  time: string;
  fastestLap: string;
  averageLap: string;
  topSpeed: string;
  totalLaps: string;
  maxLean: string;
  avgLean: string;
  trackTemp: string;
};

export function SessionCard({ session }: { session: Session }) {
  return (
    <Card className="bg-muted/30 text-white rounded-xl shadow-sm">
      <CardContent className="p-4 flex flex-col gap-4">
        {/* Header */}
        <div className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-400" />
            <span>{session.location}</span>
          </div>
          <span>
            {session.date} {session.time}
          </span>
        </div>

        {/* Fastest lap & avg lap */}
        <div className="flex justify-between items-center">
          <div>
            <div className="text-3xl font-bold">{session.fastestLap}</div>
            <div className="text-orange-400 text-sm">Fastest Lap</div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-blue-400 bg-blue-400/10 px-2 py-1 rounded-md text-sm flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {session.averageLap}
            </div>
            <div className="text-sm text-muted-foreground">Average Lap</div>
          </div>
        </div>

        {/* Speed + Laps */}
        <div className="flex justify-between text-sm">
          <div>
            <span className="text-white font-medium">{session.topSpeed}</span>
            <span className="text-muted-foreground ml-1">Top speed</span>
          </div>
          <div>
            <span className="text-white font-medium">{session.totalLaps}</span>
            <span className="text-muted-foreground ml-1">Total Laps</span>
          </div>
        </div>

        {/* Lean + Temp */}
        <div className="flex justify-between text-sm pt-2 border-t border-white/10">
          <div>
            <span className="font-medium text-white">Max Lean </span>
            {session.maxLean}
            <br />
            <span className="font-medium text-white">Avg Lean </span>
            {session.avgLean}
          </div>
          <div className="text-right">
            <span className="text-muted-foreground">Est Track Temp</span>
            <br />
            <span className="text-white font-semibold">
              {session.trackTemp}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
