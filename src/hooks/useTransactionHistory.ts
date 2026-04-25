import { useInfiniteQuery } from '@tanstack/react-query';
import { mobileCardService } from '@/lib/mobile-card-service';

export function useTransactionHistory(limit = 10) {
  return useInfiniteQuery({
    queryKey: ['transactionHistory', limit],
    queryFn: async ({ pageParam = null }) => {
      return await mobileCardService.getHistory(pageParam, limit);
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
    initialPageParam: null as string | null,
  });
}
