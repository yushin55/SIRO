import api from '../api'

export interface UserProfile {
  userId: string
  email: string
  name: string
  university?: string
  major?: string
  studentId?: string
  targetJob?: string
  profileImage?: string
  createdAt: string
  stats: {
    totalLogs: number
    totalProjects: number
    totalKeywords: number
  }
}

export interface UpdateProfileData {
  name?: string
  university?: string
  major?: string
  targetJob?: string
}

export const usersApi = {
  // 내 프로필 조회
  getMe: async () => {
    const response = await api.get<{ success: boolean; data: UserProfile }>('/users/me')
    return response.data
  },

  // 프로필 수정
  updateMe: async (data: UpdateProfileData) => {
    const response = await api.patch<{ success: boolean; data: UserProfile }>(
      '/users/me',
      data
    )
    return response.data
  },

  // 프로필 이미지 업로드
  uploadProfileImage: async (file: File) => {
    const formData = new FormData()
    formData.append('image', file)

    const response = await api.post('/users/me/profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },
}
