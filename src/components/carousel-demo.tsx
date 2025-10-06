"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link"; // Added Link import
import { Card, CardContent } from "@/registry/new-york-v4/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/registry/new-york-v4/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/registry/new-york-v4/ui/dialog";
import { Button } from "@/registry/new-york-v4/ui/button";
import { MapPin } from "lucide-react";

import { useSessions } from "@/hooks/useSessions";
import { RefreshButton } from "@/components/RefreshBtn";

interface Session {
  id: string;
  average_lap: string;
  fastest_lap: string;
  total_laps: number;
  avg_lean_angle: number;
  max_lean_angle: number;
  top_speed: number;
  track_name: string;
  track_temperature: string;
  created_at: string;

  date?: string;
  time?: string;
  location?: string;
}

// List item with corrected keys and Link wrapper
function SessionListItem({ session }: { session: Session }) {
  return (
    <Link href={`/sessions/${session.id}`}>
      <div className="flex justify-between items-center bg-neutral-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-white cursor-pointer hover:bg-neutral-800 transition">
        <div className="flex flex-col">
          <span className="font-medium">
            {session.track_name || "Untitled Session"}
          </span>
          <span className="text-white/60 text-xs">
            {session.created_at.slice(0, 10)} —{" "}
            {new Date(session.created_at).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </span>
        </div>
        <div className="text-right">
          <div className="text-white/80 font-semibold">
            {session.fastest_lap.startsWith("00:")
              ? session.fastest_lap.slice(3)
              : session.fastest_lap}
          </div>
          <div className="text-white/40 text-xs">Fastest Lap</div>
        </div>
      </div>
    </Link>
  );
}


export function SessionCard({ session }: { session: Session }) {
  return (
    <Card className="w-xl">
      <CardContent className="p-6 space-y-6">
        {/* TOP: Track name + date/time */}
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
              {new Date(session.created_at).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
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
            <p className="text-orange-500 mt-1 text-lg">Fastest Lap</p>
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
                <p className="text-white/60 text-sm">Total Laps</p>
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
  );
}
interface CarouselDemoProps {
  sessions: Session[];
  isLoading?: boolean;
  error?: string | null;
  refresh?: () => void;
}

export function CarouselDemo({
  sessions,
  isLoading = false,
  error = null,
  refresh,
}: CarouselDemoProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const sessionsWithDateTime = sessions.map((session) => {
    if (session.created_at) {
      const d = new Date(session.created_at);

      return {
        ...session,
        date: d.toLocaleDateString(),
        time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
    }
    
    return session;
  });

  const filteredSessions = sessionsWithDateTime.filter((session) =>
    Object.values(session)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-4xl rounded-2xl shadow-md p-6 rounded-xl shadow-sm transition hover:shadow-md xl:flex xl:flex-col xl:justify-center">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold text-white">Recent Sessions</h2>

        <div className="flex gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>All Sessions</DialogTitle>
                {refresh && (
                  <RefreshButton
                    onRefresh={refresh}
                    size="sm"
                    variant="outline"
                  />
                )}
              </DialogHeader>

              <input
                type="text"
                placeholder="Search sessions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 px-4 mt-2 rounded-md bg-neutral-900 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/10"
              />

              <div className="flex flex-col gap-3 mt-4">
                {filteredSessions.length > 0 ? (
                  filteredSessions.map((session, index) => (
                    <SessionListItem key={index} session={session} />
                  ))
                ) : (
                  <div className="text-white/60 text-center mt-6">
                    No sessions found.
                  </div>
                )}
              </div>

              <DialogClose asChild>
                <Button variant="ghost" className="mt-6 w-full">
                  Close
                </Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Loading & Error */}
      {isLoading && (
        <div className="text-white text-center mb-4">Loading sessions...</div>
      )}
      {error && (
        <div className="text-red-500 text-center mb-4">
          Failed to load sessions.
        </div>
      )}

      {/* Carousel */}
      <Carousel className="w-full max-w-3xl mt-6 flex flex-col items-center gap-8 overflow-visible">
        <div className="w-full px-4">
          <CarouselContent
            className="flex items-center space-x-7 px-6"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {sessionsWithDateTime.slice(0, 7).map((session, index) => (
              <CarouselItem
                key={session.id || index}
                className="basis-[85%] shrink-0 grow-0 scroll-snap-align-center"
              >
                <Link href={`/sessions/${session.id}`}>
                  <SessionCard session={session} />
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </div>

        <div className="flex gap-3 items-center justify-center w-full px-6">
          <CarouselPrevious aria-label="Previous session" className="static" />
          <CarouselNext aria-label="Next session" className="static" />
        </div>
      </Carousel>
    </div>
  );
}
