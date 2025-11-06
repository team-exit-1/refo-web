import axios from 'axios';

// 개발 환경에서는 Vite 프록시 사용, 프로덕션에서는 실제 API URL 사용
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.refo.family';

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    // 인증 토큰이 있다면 헤더에 추가
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => {
    // API 응답 구조: { status, code, message, data }
    return response;
  },
  (error) => {
    if (error.response) {
      // 서버 응답이 있는 경우
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // 인증 실패 - 로그인 페이지로 리다이렉트
          console.error('인증이 필요합니다.');
          localStorage.removeItem('auth_token');
          // window.location.href = '/login';
          break;
        case 403:
          console.error('권한이 없습니다.');
          break;
        case 404:
          console.error('요청한 리소스를 찾을 수 없습니다.');
          break;
        case 500:
          console.error('서버 오류가 발생했습니다.');
          break;
        default:
          console.error('오류가 발생했습니다:', data?.message || error.message);
      }
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못한 경우
      console.error('서버로부터 응답이 없습니다. 네트워크를 확인해주세요.');
    } else {
      // 요청 설정 중 오류가 발생한 경우
      console.error('요청 중 오류가 발생했습니다:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
