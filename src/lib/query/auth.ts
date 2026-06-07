import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProfile, updateProfile } from '@/lib/api/auth';

export const authQueryKeys = {
  profile: ['auth', 'profile'] as const,
};

export function useProfile(enabled = true) {
  return useQuery({
    queryKey: authQueryKeys.profile,
    queryFn: getProfile,
    enabled,
  });
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name?: string;
      email?: string;
      phone?: string;
      avatar?: string;
    }) => updateProfile(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};
