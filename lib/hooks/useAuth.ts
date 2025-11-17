import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authApi, type LoginData, type RegisterData } from '../api/auth'
import toast from 'react-hot-toast'

export function useAuth() {
  const router = useRouter()
  const queryClient = useQueryClient()

  // 로그인 뮤테이션
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // 토큰 저장
      localStorage.setItem('access_token', data.data.accessToken)
      localStorage.setItem('refresh_token', data.data.refreshToken)
      
      toast.success('로그인 성공!')
      router.push('/dashboard')
      
      // 사용자 데이터 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || '로그인에 실패했습니다.')
    },
  })

  // 회원가입 뮤테이션
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      // 토큰 저장
      localStorage.setItem('access_token', data.data.accessToken)
      localStorage.setItem('refresh_token', data.data.refreshToken)
      
      toast.success('회원가입 성공!')
      router.push('/dashboard')
      
      // 사용자 데이터 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || '회원가입에 실패했습니다.')
    },
  })

  // 로그아웃 뮤테이션
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // 토큰 제거
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      
      toast.success('로그아웃 되었습니다.')
      router.push('/auth/login')
      
      // 모든 쿼리 캐시 초기화
      queryClient.clear()
    },
  })

  return {
    login: (data: LoginData) => loginMutation.mutate(data),
    register: (data: RegisterData) => registerMutation.mutate(data),
    logout: () => logoutMutation.mutate(),
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  }
}
