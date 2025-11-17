import api from '../api';

// 추천 활동 API
export const recommendationsApi = {
  // 추천 활동 목록 조회
  getActivities: async (params?: {
    type?: string;
    category?: string;
    level?: string;
    limit?: number;
  }) => {
    const response = await api.get('/recommendations/activities', {
      params,
    });
    return response.data;
  },

  // 활동 상세 조회
  getActivityById: async (id: string) => {
    const response = await api.get(
      `/recommendations/activities/${id}`
    );
    return response.data;
  },

  // 활동 북마크
  bookmarkActivity: async (id: string) => {
    const response = await api.post(
      `/recommendations/activities/${id}/bookmark`
    );
    return response.data;
  },

  // 북마크 삭제
  unbookmarkActivity: async (id: string) => {
    const response = await api.delete(
      `/recommendations/activities/${id}/bookmark`
    );
    return response.data;
  },

  // 북마크 목록 조회
  getBookmarks: async () => {
    const response = await api.get('/recommendations/bookmarks');
    return response.data;
  },
};

// 회고 API
export const reflectionsApi = {
  // 회고 목록 조회
  getAll: async (params?: {
    log_id?: string;
    cycle?: string;
    start_date?: string;
    end_date?: string;
    limit?: number;
  }) => {
    const response = await api.get('/reflections', { params });
    return response.data;
  },

  // 회고 상세 조회
  getById: async (id: string) => {
    const response = await api.get(`/reflections/${id}`);
    return response.data;
  },

  // 회고 작성
  create: async (data: {
    log_id?: string;
    project_id?: string;
    cycle: string;
    content: string;
    answers?: { question: string; answer: string }[];
    mood: string;
    progress_score: number;
  }) => {
    const response = await api.post('/reflections', data);
    return response.data;
  },

  // 회고 수정
  update: async (
    id: string,
    data: {
      content?: string;
      mood?: string;
      progress_score?: number;
    }
  ) => {
    const response = await api.patch(`/reflections/${id}`, data);
    return response.data;
  },

  // 회고 삭제
  delete: async (id: string) => {
    const response = await api.delete(`/reflections/${id}`);
    return response.data;
  },

  // 회고 통계 조회
  getStats: async (period: 'week' | 'month' | 'year' = 'month') => {
    const response = await api.get('/reflections/stats', {
      params: { period },
    });
    return response.data;
  },
};

// 회고 설정 API
export const reflectionSettingsApi = {
  // 회고 설정 생성
  create: async (data: {
    log_id: string;
    cycle: string;
    enabled: boolean;
    reminder_time: string;
    questions: string[];
  }) => {
    const response = await api.post('/reflections/settings', data);
    return response.data;
  },

  // 회고 설정 조회
  getByLogId: async (logId: string) => {
    const response = await api.get(
      `/reflections/settings?log_id=${logId}`
    );
    return response.data;
  },

  // 회고 설정 수정
  update: async (
    id: string,
    data: {
      cycle?: string;
      enabled?: boolean;
      reminder_time?: string;
      questions?: string[];
    }
  ) => {
    const response = await api.patch(
      `/reflections/settings/${id}`,
      data
    );
    return response.data;
  },
};
