import api from '../api'

export interface CreateLogData {
  activityId: string
  content: string
  reflections?: string
  tags?: string[]
  date?: string
}

export interface LogListParams {
  page?: number
  limit?: number
  activityId?: string
  startDate?: string
  endDate?: string
}

export interface Log {
  id: string
  activityId: string
  content: string
  reflections?: string
  tags?: string[]
  date: string
  createdAt: string
  updatedAt: string
}

export const logsApi = {
  // 로그 목록 조회
  list: async (params: LogListParams) => {
    const response = await api.get('/logs', { params })
    return response.data
  },

  // 로그 상세 조회
  get: async (logId: string) => {
    const response = await api.get(`/logs/${logId}`)
    return response.data
  },

  // 로그 생성
  create: async (data: CreateLogData) => {
    const response = await api.post('/logs', data)
    return response.data
  },

  // 로그 수정
  update: async (logId: string, data: Partial<CreateLogData>) => {
    const response = await api.put(`/logs/${logId}`, data)
    return response.data
  },

  // 로그 삭제
  delete: async (logId: string) => {
    const response = await api.delete(`/logs/${logId}`)
    return response.data
  },
}
