"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { CarouselDemo } from "@/components/carousel-demo";
import { RefreshButton } from "@/components/RefreshBtn";
import { useSessionTrends } from "@/hooks/useTrends";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/registry/new-york-v4/ui/sidebar";
import InsightsPanel from "@/components/InsightsPanel";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; 
import { UserAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

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

export default function Page() {
  const { fetchTrends } = useSessionTrends();
  const [sessions, setSessions] = useState<Session[]>([]);
  const { session } = UserAuth();
  const router = useRouter();

  const handleRefresh = async () => {
    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .order("created_at", { ascending: false })
      // .eq("user_id", user?.id) CHANGING CLERK TO SUPABASE

    if (error) {
      console.error("Error fetching sessions:", error);
      setSessions([]);
    } else {
      setSessions(data || []);
    }
  };

  useEffect(() => {
    handleRefresh();
  }, []);


  useEffect(() => {
    if (session === null) {
      // No user -> redirect to login
      router.push("/sign-up");
    }
  }, [session, router]);

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 73)",
          "--header-height": "calc(var(--spacing) * 11)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 text-white px-4 py-6 md:px-8 rounded-b-lg mb-6 shadow-lg">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-6">
              <SidebarTrigger className="-ml-1" />
              <div className="">
                <h1 className="text-2xl md:text-3xl font-bold">
                  Welcome TEST
                </h1>
                <p className="mt-2 text-base md:text-lg opacity-90">
                  Here’s an overview of your recent sessions and insights.
                </p>
              </div>
            </div>
            <RefreshButton onRefresh={handleRefresh} variant="default" />
          </div>
        </div>

        <main className="px-4 md:px-8 flex flex-col gap-6">
          {/* Carousel + Insights side by side on md+ */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <CarouselDemo sessions={sessions} refresh={handleRefresh} />
            </div>
            <div className="flex-1">
              <InsightsPanel />
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
