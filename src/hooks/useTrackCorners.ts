"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; 
import { useAuth } from "@clerk/nextjs";

interface CornerPoint {
  lat: number;
  lon: number;
}

export function useTrackCorners(trackId: string | null) {
  const [corners, setCorners] = useState<CornerPoint[] | null>(null);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    if (!trackId) return;

    const fetchCorners = async () => {
      setLoading(true);
      try {
        const token = await getToken({ template: "supabase" });
        if (!token) throw new Error("No auth token found");


        const { data, error } = await supabase
          .from("track_configurations")
          .select("corners")
          .eq("track_id", trackId)
          .single();

        if (error) {
          console.error("Error fetching track corners:", error);
          setCorners(null);
        } else {
          setCorners(data?.corners || []);
        }
      } catch (error) {
        console.error(error);
        setCorners(null);
      }
      setLoading(false);
    };

    fetchCorners();
  }, [trackId, getToken]);

  return { corners, loading };
}
