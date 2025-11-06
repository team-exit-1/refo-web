import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Leaflet 마커 아이콘 경로 수정 (기본 아이콘이 안 보이는 문제 해결)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export interface MapOptions {
  center: [number, number]; // [latitude, longitude]
  zoom?: number;
  marker?: {
    position: [number, number];
    popup?: string;
  };
}

export function createMap(containerId: string, options: MapOptions): L.Map {
  const { center, zoom = 13, marker } = options;
  
  // 지도 생성
  const map = L.map(containerId).setView(center, zoom);
  
  // OpenStreetMap 타일 레이어 추가
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map);
  
  // 마커 추가 (옵션)
  if (marker) {
    const leafletMarker = L.marker(marker.position).addTo(map);
    if (marker.popup) {
      leafletMarker.bindPopup(marker.popup);
    }
  }
  
  return map;
}

// 지도 초기화 (Promise 기반)
export function initMap(containerId: string, options: MapOptions): Promise<L.Map> {
  return new Promise((resolve) => {
    // DOM이 준비될 때까지 대기
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        const map = createMap(containerId, options);
        resolve(map);
      });
    } else {
      const map = createMap(containerId, options);
      resolve(map);
    }
  });
}