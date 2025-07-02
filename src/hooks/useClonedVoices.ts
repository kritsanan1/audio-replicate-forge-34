
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ClonedVoice = {
  id: string;
  voice_id: string;
  name: string;
  original_filename: string | null;
  preview_url: string | null;
  model_used: string | null;
  created_at: string;
};

export const useClonedVoices = () => {
  return useQuery({
    queryKey: ["cloned-voices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cloned_voices")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return data as ClonedVoice[];
    },
  });
};

export const useInvalidateClonedVoices = () => {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: ["cloned-voices"] });
  };
};
