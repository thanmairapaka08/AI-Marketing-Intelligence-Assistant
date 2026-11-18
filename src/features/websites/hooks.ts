import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/app/query-keys";
import { websitesService } from "@/services/websites.service";

export function useWebsites() {
  return useQuery({ queryKey: queryKeys.websites, queryFn: () => websitesService.list() });
}

export function useCreateWebsite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: websitesService.create,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: queryKeys.websites }),
  });
}

export function useDeleteWebsite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => websitesService.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.websites });
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}
