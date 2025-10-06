"use client";

import useSWR from "swr";
import { supabase } from "@/lib/supabase";

export type Insight = {
  id: string;
  user_id: string;
  session_id: string;
  overview: string;
  tips: string;
  lap_over_lap: string;
  session_over_session: string;
  viewed: boolean;
  created_at: string;
  deleted: boolean;
  sessions?: {
    track_name: string;
  };
};

export function useInsights(sessionId?: string) {

  const fetchInsights = async (): Promise<Insight[]> => {
    let query = supabase
      .from("insights")
      .select(
        `
        *,
        sessions (
          track_name
        )
      `
      )
      .eq("deleted", false)
      // .eq("user_id", user?.id) CHANGING CLERK TO SUPABASE
      .order("created_at", { ascending: false });

    if (sessionId) {
      query = query.eq("session_id", sessionId);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    return data as Insight[];
  };

  const { data, error, isLoading, mutate } = useSWR<Insight[]>(
    sessionId ? `insights-${sessionId}` : "insights",
    fetchInsights,
    {
      revalidateOnFocus: false,
      refreshInterval: 0,
    }
  );

  return {
    insights: data || [],
    error,
    isLoading,
    insightRefresh: () => mutate(),
  };
}
