import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCurrentUser, logout } from '@/services/api';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    retry: false,
  });

  const user = response?.data;

  const handleLogout = async () => {
    try {
      await logout();
      queryClient.setQueryData(['currentUser'], null);
      router.push('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    logout: handleLogout,
    refetchUser: () => queryClient.invalidateQueries({ queryKey: ['currentUser'] }),
  };
}
