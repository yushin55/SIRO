import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { usersApi, type UpdateProfileData } from '../api/users'
import toast from 'react-hot-toast'

export function useUser() {
  const queryClient = useQueryClient()

  // 사용자 프로필 조회
  const { data, isLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: usersApi.getMe,
    retry: false,
  })

  // 프로필 수정 뮤테이션
  const updateMutation = useMutation({
    mutationFn: usersApi.updateMe,
    onSuccess: () => {
      toast.success('프로필이 업데이트되었습니다!')
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || '프로필 수정에 실패했습니다.')
    },
  })

  // 프로필 이미지 업로드 뮤테이션
  const uploadImageMutation = useMutation({
    mutationFn: usersApi.uploadProfileImage,
    onSuccess: () => {
      toast.success('프로필 이미지가 업데이트되었습니다!')
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || '이미지 업로드에 실패했습니다.')
    },
  })

  return {
    user: data?.data,
    isLoading,
    error,
    updateProfile: (data: UpdateProfileData) => updateMutation.mutate(data),
    uploadProfileImage: (file: File) => uploadImageMutation.mutate(file),
    isUpdating: updateMutation.isPending,
    isUploadingImage: uploadImageMutation.isPending,
  }
}
