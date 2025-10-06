"use client";

import { useParams } from "next/navigation";
import { useSessionStore } from "@/lib/sessionStore";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import MapBoxMap from "@/components/MapBoxMap";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/registry/new-york-v4/ui/sidebar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/new-york-v4/ui/tabs";
import { Card, CardContent } from "@/registry/new-york-v4/ui/card";
import { MapPin, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/registry/new-york-v4/ui/dialog";
import { RefreshButton } from "@/components/RefreshBtn";

import { SessionCard } from "@/components/carousel-demo";

interface Session {
  id: string;
  track_id: string;
  average_lap: string;
  fastest_lap: string;
  total_laps: number;
  avg_lean_angle: number;
  max_lean_angle: number;
  top_speed: number;
  track_name: string;
  track_temperature: string;
  track_latitude: number;
  track_longitude: number;
  created_at: string;
}

interface Lap {
  id: string;
  lap_number: number;
  time: string;
  top_speed: number;
  avg_lean_angle: number;
  max_lean_angle: number;
  rating: number;
  overall_feedback: {
    summary: string;
    strengths: string[];
    weaknesses: string[];
  };
}

interface Corner {
  lat: number;
  lon: number;
}

// --- Skeleton Component ---
function SessionDetailSkeleton() {
  return (
    <div className="space-y-6 p-4 animate-pulse">
      {/* Banner */}
      <div className="h-10 w-1/3 bg-gray-700 rounded"></div>

      {/* Tabs */}
      <div className="flex gap-2">
        <div className="h-8 w-20 bg-gray-700 rounded"></div>
        <div className="h-8 w-20 bg-gray-700 rounded"></div>
        <div className="h-8 w-20 bg-gray-700 rounded"></div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-2 gap-6">
        <div className="h-130 bg-gray-700 rounded"></div>
        <div className="flex flex-col gap-6 w-full">
          <div className="h-10 bg-gray-700 rounded w-1/2"></div>
          <div className="h-64 bg-gray-700 rounded"></div>
        <div className="grid-cols-2 space-y-3.5 w-full">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-6 w-full bg-gray-700 rounded"></div>
          ))}
        </div>
        </div>
      </div>

      {/* Lap table skeleton */}
    </div>
  );
}

// --- Helper Function ---
function lapTimeToMs(time: string): number {
  const parts = time.split(":").map((part) => part.trim());
  let ms = 0;
  if (parts.length === 2) {
    const [mm, ss] = parts;
    ms += parseInt(mm, 10) * 60 * 1000;
    ms += parseFloat(ss) * 1000;
  } else if (parts.length === 3) {
    const [hh, mm, ss] = parts;
    ms += parseInt(hh, 10) * 3600 * 1000;
    ms += parseInt(mm, 10) * 60 * 1000;
    ms += parseFloat(ss) * 1000;
  } else ms = parseFloat(time) * 1000;

  return ms;
}

// --- Main Page ---
export default function SessionDetailPage() {
  const { session_id } = useParams();
  const getSessionById = useSessionStore((s) => s.getSessionById);

  const [session, setSession] = useState<Session | null>(null);
  const [laps, setLaps] = useState<Lap[]>([]);
  const [corners, setCorners] = useState<Corner[]>([]);
  const [loadingCorners, setLoadingCorners] = useState(false);
  const [selectedLap, setSelectedLap] = useState<Lap | null>(null);

  // --- Fetch data ---
  const handleRefresh = async () => {
    if (!session_id) return;
    // Fetch session
    const { data: sessionData, error: sessionError } = await supabase
      .from("sessions")
      .select("*")
      .eq("id", session_id)
      .single();
    if (sessionError) {
      console.error("Error fetching session:", sessionError);
      setSession(null);
    } else setSession(sessionData);

    // Fetch laps
    const { data: lapsData, error: lapsError } = await supabase
      .from("laps")
      .select("*")
      .eq("session_id", session_id)
      .order("lap_number", { ascending: true });
    if (lapsError) {
      console.error("Error fetching laps:", lapsError);
      setLaps([]);
    } else setLaps(lapsData || []);

    // Fetch corners
    setLoadingCorners(true);
    const { data: lapsDataRows, error } = await supabase
      .from("lap_data")
      .select("lap_number, data")
      .eq("session_id", session_id)
      .order("lap_number", { ascending: true });
    if (error) {
      console.error("Error fetching lap data:", error);
      setCorners([]);
      setLoadingCorners(false);

      return;
    }

    if (lapsDataRows && lapsDataRows.length > 0) {
      const middleIndex = Math.floor(lapsDataRows.length / 2);
      const middleLapData = lapsDataRows[middleIndex].data;
      if (Array.isArray(middleLapData)) {
        const middleLapCorners = middleLapData.map((point: any) => ({
          lat: point.lat,
          lon: point.lng,
        }));
        setCorners(middleLapCorners);
      } else setCorners([]);
    } else setCorners([]);

    setLoadingCorners(false);
  };

  useEffect(() => {
    handleRefresh();
  }, [session_id]);

  // --- Compute fastest lap ---
  const fastestLapIndex = laps.reduce((fastestIdx, lap, idx) => {
    const lapMs = lapTimeToMs(lap.time);
    const fastestMs = fastestIdx === -1 ? Infinity : lapTimeToMs(laps[fastestIdx].time);
    
    return lapMs < fastestMs ? idx : fastestIdx;
  }, -1);

  const fastestLapId =
    fastestLapIndex !== -1 ? laps[fastestLapIndex].lap_number : null;

  // --- Render ---
  if (!session) {
    return (
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SessionDetailSkeleton />
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <div className="px-4 py-6 sm:px-6 lg:px-12 max-w-screen-2xl mx-auto w-full text-white">
          <Tabs defaultValue="overview" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex jusitfy-center items-center gap-4">
                <SidebarTrigger className="-ml-1" />
                <TabsList className="flex gap-2">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="sectors">Sectors</TabsTrigger>
                  <TabsTrigger value="charts">Charts</TabsTrigger>
                </TabsList>
              </div>
              <RefreshButton onRefresh={handleRefresh} variant="default" />
            </div>

            {/* ---------------- Overview ---------------- */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* LEFT: Track Map */}
                {loadingCorners ? (
                  <div className="h-64 bg-gray-700 rounded animate-pulse" />
                ) : (
                  <MapBoxMap
                    latitude={session.track_latitude}
                    longitude={session.track_longitude}
                    corners={corners ?? []}
                  />
                )}

                {/* RIGHT: Session Summary + Table */}
                <div className="flex flex-col gap-6 w-full">
                  {/* Summary */}
                  <h3 className="text-xl font-semibold mt-4">
                    Session Summary
                  </h3>
                  <Card className="w-[43rem]">
                    <CardContent className="p-6 space-y-6">
                      <div className="flex flex-col sm:flex-row justify-between border-b border-white/20 pb-4 gap-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-orange-500" />
                          <p className="text-sm sm:text-base text-white/80 truncate">
                            {session.track_name}
                          </p>
                        </div>
                        <div className="flex gap-2 text-sm text-white/60">
                          <p>{session.created_at.slice(0, 10)}</p>
                          <p>
                            {new Date(session.created_at).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )}
                          </p>
                        </div>
                      </div>

                      {/* MID: Stats */}
                      <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
                        <div className="text-center w-full md:w-auto">
                          <h1 className="text-5xl font-bold text-white">
                            {session.fastest_lap.startsWith("00:")
                              ? session.fastest_lap.slice(3)
                              : session.fastest_lap}
                          </h1>
                          <p className="text-orange-500 mt-1 text-lg">
                            Fastest Lap
                          </p>
                        </div>

                        <div className="flex-1 space-y-4 flex flex-col items-end justify-between mr-4">
                          <div className="border-2 border-blue-500 text-blue-500 rounded-xl py-3 px-8 text-center">
                            <p className="text-lg font-semibold">
                              {session.average_lap.startsWith("00:")
                                ? session.average_lap.slice(3)
                                : session.average_lap}
                            </p>
                            <p className="text-sm font-light">Average Lap</p>
                          </div>

                          <div className="flex justify-around text-center ml-[10px] gap-4">
                            <div>
                              <p className="text-white text-lg font-semibold">
                                {session.top_speed} mph
                              </p>
                              <p className="text-white/60 text-sm">Top Speed</p>
                            </div>
                            <div>
                              <p className="text-white text-lg font-semibold">
                                {session.total_laps}
                              </p>
                              <p className="text-white/60 text-sm">
                                Total Laps
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* BOTTOM: Lean + Temp */}
                      <div className="flex flex-wrap justify-between gap-4 pt-4 border-t border-white/20">
                        <div className="flex gap-6 flex-wrap">
                          <div className="flex items-center gap-2">
                            <p className="text-white/70 text-sm">Max Lean</p>
                            <span className="text-white text-base font-semibold">
                              {session.max_lean_angle}°
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-white/70 text-sm">Avg Lean</p>
                            <span className="text-white text-base font-semibold">
                              {session.avg_lean_angle}°
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-white/70 text-sm">Track Temp</p>
                          <p className="text-white text-base font-semibold">
                            {session.track_temperature}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Lap Table */}
                  <Card className="w-full">
                    <h3 className="text-xl font-semibold ml-4 mt-4">
                      Lap Data
                    </h3>
                    <CardContent className="overflow-x-auto">
                      <table className="min-w-full text-sm text-left text-white border border-white/10 rounded-md">
                        <thead className="bg-white/10">
                          <tr>
                            <th className="px-4 py-2">Lap</th>
                            <th className="px-4 py-2">Time</th>
                            <th className="px-4 py-2">Top Speed</th>
                            <th className="px-4 py-2">Avg Lean</th>
                            <th className="px-4 py-2">Max Lean</th>
                            <th className="px-4 py-2">Rating</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                          {laps.map((lap) => (
                            <Dialog key={lap.lap_number}>
                              <DialogTrigger asChild>
                                <tr
                                  onClick={() => setSelectedLap(lap)}
                                  className={`hover:bg-white/10 cursor-pointer ${
                                    lap.lap_number === fastestLapId
                                      ? "bg-white/10 font-semibold"
                                      : ""
                                  }`}
                                >
                                  <td className="px-4 py-2">
                                    {lap.lap_number}
                                  </td>
                                  <td className="px-4 py-2">{lap.time}</td>
                                  <td className="px-4 py-2">
                                    {lap.top_speed} km/h
                                  </td>
                                  <td className="px-4 py-2">
                                    {lap.avg_lean_angle?.toFixed(1)}°
                                  </td>
                                  <td className="px-4 py-2">
                                    {lap.max_lean_angle?.toFixed(1)}°
                                  </td>
                                  <td className="px-4 py-2">
                                    {lap.rating ?? "N/A"}
                                  </td>
                                </tr>
                              </DialogTrigger>
                              <DialogContent className="bg-zinc-900 text-white max-w-2xl rounded-2xl p-8 shadow-xl max-h-[90vh] overflow-y-auto space-y-8 animate-in fade-in zoom-in-90 duration-300 ease-out">
                                {/* Dialog content unchanged */}
                                {/* ...keep your current dialog content here */}
                              </DialogContent>
                            </Dialog>
                          ))}
                        </tbody>
                      </table>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sectors">
              <p className="text-muted-foreground">Sectors coming soon...</p>
            </TabsContent>

            <TabsContent value="charts">
              <p className="text-muted-foreground">Charts coming soon...</p>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
