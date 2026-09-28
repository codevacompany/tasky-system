import apiClient from '@/utils/axiosInstance';

export const featureTipService = {
  markSeen(tipId: string) {
    return apiClient.post<{ tipId: string; seenAt: string }>('/users/me/feature-tips/seen', {
      tipId,
    });
  },
};
