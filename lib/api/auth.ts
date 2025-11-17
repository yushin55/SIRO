import api from '../api'

export interface RegisterData {
  email: string
  password: string
  name: string
  university?: string
  major?: string
  studentId?: string
  targetJob?: string
}

export interface LoginData {
  email: string
  password: string
}

export interface AuthResponse {
  userId: string
  email: string
  name: string
  accessToken: string
  refreshToken: string
}

export const authApi = {
  // 회원가입
  register: async (data: RegisterData) => {
    const response = await api.post<{ success: boolean; data: AuthResponse }>(
      '/auth/register',
      data
    )
    return response.data
  },

  // 로그인
  login: async (data: LoginData) => {
    const response = await api.post<{ success: boolean; data: AuthResponse }>(
      '/auth/login',
      data
    )
    return response.data
  },

  // 로그아웃
  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  },

  // 토큰 갱신
  refresh: async (refreshToken: string) => {
    const response = await api.post<{ success: boolean; data: { accessToken: string } }>(
      '/auth/refresh',
      { refreshToken }
    )
    return response.data
  },
}
