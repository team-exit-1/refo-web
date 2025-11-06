import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useElderStore } from '../stores/elderStore';
import { useLocationStore } from '../stores/locationStore';

export default function SafeZoneSettings() {
  const navigate = useNavigate();
  const currentElder = useElderStore((state) => state.currentElder);
  const { safeZone, setSafeZone } = useLocationStore();

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const circleRef = useRef<L.Circle | null>(null);

  const [radius, setRadius] = useState<number>(safeZone?.radius || 500);

  // 지도 초기화
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Leaflet 기본 아이콘 설정
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      const center = safeZone?.center || { lat: 37.5665, lng: 126.978 };
      
      const map = L.map(mapRef.current).setView([center.lat, center.lng], 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;

      // 지도 클릭 시 안전구역 중심 설정
      map.on('click', (e: L.LeafletMouseEvent) => {
        setSafeZone({
          center: {
            lat: e.latlng.lat,
            lng: e.latlng.lng,
          },
          radius: radius,
        });
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 안전구역 원 그리기
  useEffect(() => {
    if (mapInstanceRef.current && safeZone) {
      // 기존 원 제거
      if (circleRef.current) {
        circleRef.current.remove();
      }

      // 새 원 그리기
      circleRef.current = L.circle([safeZone.center.lat, safeZone.center.lng], {
        radius: radius,
        color: '#AE93DF',
        fillColor: '#AE93DF',
        fillOpacity: 0.2,
        weight: 2,
      }).addTo(mapInstanceRef.current);

      // 지도 중심 이동
      mapInstanceRef.current.panTo([safeZone.center.lat, safeZone.center.lng]);
    }
  }, [safeZone, radius]);

  // 반경 변경 시 업데이트
  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);
    if (safeZone) {
      setSafeZone({
        center: safeZone.center,
        radius: newRadius,
      });
    }
  };

  // 저장 버튼
  const handleSave = () => {
    // TODO: API 호출하여 서버에 저장
    alert('안전구역이 저장되었습니다!');
  };

  // 돌아가기
  const handleGoBack = () => {
    navigate('/location');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-bold text-neutral-gray-dark">안전구역 설정</h1>
          <p className="text-body text-neutral-gray-medium mt-1">
            {currentElder?.name}님의 안전구역을 설정하세요
          </p>
        </div>
        <button
          onClick={handleGoBack}
          className="btn-secondary flex items-center gap-2"
        >
          ← 돌아가기
        </button>
      </div>

      {/* 사용 방법 */}
      <div className="card p-4 bg-primary/10">
        <p className="text-sm text-neutral-gray-dark">
          💡 <strong>지도를 클릭</strong>하여 안전구역의 중심을 설정하고, 
          아래 슬라이더로 반경을 조절하세요.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 지도 */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card overflow-hidden">
            <div ref={mapRef} className="w-full h-[500px]" />
          </div>

          {/* 반경 조절 */}
          <div className="card p-6">
            <label className="block text-sm font-semibold text-neutral-gray-dark mb-3">
              안전구역 반경: {radius}m
            </label>
            <input
              type="range"
              min="100"
              max="2000"
              step="50"
              value={radius}
              onChange={(e) => handleRadiusChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-neutral-gray-medium mt-2">
              <span>100m</span>
              <span>2000m</span>
            </div>
          </div>
        </div>

        {/* 정보 패널 */}
        <div className="space-y-4">
          {/* 현재 설정 */}
          <div className="card p-6">
            <h3 className="text-h3 font-semibold text-neutral-gray-dark mb-4">
              현재 설정
            </h3>
            {safeZone ? (
              <div className="space-y-3">
                <div>
                  <div className="text-caption text-neutral-gray-medium">중심 위치</div>
                  <div className="text-sm text-neutral-gray-dark mt-1 font-mono">
                    {safeZone.center.lat.toFixed(4)}, {safeZone.center.lng.toFixed(4)}
                  </div>
                </div>
                <div>
                  <div className="text-caption text-neutral-gray-medium">반경</div>
                  <div className="text-sm text-neutral-gray-dark mt-1">
                    {radius}m
                  </div>
                </div>
                <div className="pt-3 border-t">
                  <div className="text-xs text-neutral-gray-medium">
                    ✓ 안전구역이 설정되었습니다
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-neutral-gray-medium text-center py-4">
                지도를 클릭하여<br />안전구역을 설정하세요
              </div>
            )}
          </div>

          {/* 알림 설정 */}
          <div className="card p-6 bg-error/10">
            <h3 className="text-h3 font-semibold text-neutral-gray-dark mb-3">
              ⚠️ 알림
            </h3>
            <p className="text-sm text-neutral-gray-medium">
              {currentElder?.name}님이 안전구역을 벗어나면 즉시 알림을 받습니다.
            </p>
          </div>

          {/* 저장 버튼 */}
          {safeZone && (
            <button
              onClick={handleSave}
              className="btn-primary w-full"
            >
              💾 설정 저장
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
