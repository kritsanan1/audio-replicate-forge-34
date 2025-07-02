
import { useQuery, useQueryClient } from "@tanstack/react-query";

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
      // Mock implementation - returns empty array since cloned_voices table doesn't exist
      // This should be replaced with actual Supabase integration once the table is created
      console.log("Warning: cloned_voices table not found in Supabase schema. Returning empty array.");
      return [] as ClonedVoice[];
    },
  });
};

export const useInvalidateClonedVoices = () => {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: ["cloned-voices"] });
  };
};
