import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { logsApi, type CreateLogData, type LogListParams } from '../api/logs'
import toast from 'react-hot-toast'

export function useLogs(params?: LogListParams) {
  const queryClient = useQueryClient()

  // 로그 목록 조회
  const { data, isLoading, error } = useQuery({
    queryKey: ['logs', params],
    queryFn: () => logsApi.list(params || {}),
  })

  // 로그 생성 뮤테이션
  const createMutation = useMutation({
    mutationFn: logsApi.create,
    onSuccess: () => {
      toast.success('로그가 생성되었습니다!')
      queryClient.invalidateQueries({ queryKey: ['logs'] })
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || '로그 생성에 실패했습니다.')
    },
  })

  // 로그 수정 뮤테이션
  const updateMutation = useMutation({
    mutationFn: ({ logId, data }: { logId: string; data: Partial<CreateLogData> }) =>
      logsApi.update(logId, data),
    onSuccess: () => {
      toast.success('로그가 수정되었습니다!')
      queryClient.invalidateQueries({ queryKey: ['logs'] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || '로그 수정에 실패했습니다.')
    },
  })

  // 로그 삭제 뮤테이션
  const deleteMutation = useMutation({
    mutationFn: logsApi.delete,
    onSuccess: () => {
      toast.success('로그가 삭제되었습니다!')
      queryClient.invalidateQueries({ queryKey: ['logs'] })
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || '로그 삭제에 실패했습니다.')
    },
  })

  return {
    logs: data?.data?.logs || [],
    pagination: data?.data?.pagination,
    isLoading,
    error,
    createLog: (data: CreateLogData) => createMutation.mutate(data),
    updateLog: (logId: string, data: Partial<CreateLogData>) =>
      updateMutation.mutate({ logId, data }),
    deleteLog: (logId: string) => deleteMutation.mutate(logId),
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}

export function useLog(logId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['logs', logId],
    queryFn: () => logsApi.get(logId),
    enabled: !!logId,
  })

  return {
    log: data?.data,
    isLoading,
    error,
  }
}
