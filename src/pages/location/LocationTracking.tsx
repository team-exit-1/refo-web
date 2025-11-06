import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useCurrentLocation, useLocationHistory } from '../../hooks/useApi';
import { useElderStore } from '../../stores/elderStore';
import { useLocationStore } from '../../stores/locationStore';
import { Link } from 'react-router-dom';

// Leaflet 기본 마커 아이콘 설정
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export default function LocationTracking() {
  const currentElder = useElderStore((state) => state.currentElder);
  const { data: currentLocation } = useCurrentLocation(currentElder?.elder_id || '');
  const { data: locationHistory } = useLocationHistory(currentElder?.elder_id || '');
  const { safeZone, setSafeZone } = useLocationStore();

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const [isEditingZone, setIsEditingZone] = useState(false);

  // ✅ Leaflet 지도 초기화
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const initialLat = currentLocation?.latitude || 37.5665;
    const initialLng = currentLocation?.longitude || 126.9780;

    // 지도 생성
    const map = L.map(mapRef.current).setView([initialLat, initialLng], 15);

    // OpenStreetMap 타일 레이어 추가
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    // 초기 마커 추가
    if (currentLocation) {
      markerRef.current = L.marker([currentLocation.latitude, currentLocation.longitude])
        .addTo(map)
        .bindPopup(currentElder?.name || '현재 위치');
    }

    // 클린업
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 현재 위치 마커 업데이트
  useEffect(() => {
    if (!mapInstanceRef.current || !currentLocation) return;

    const position: L.LatLngExpression = [currentLocation.latitude, currentLocation.longitude];

    if (markerRef.current) {
      // 기존 마커 위치 업데이트
      markerRef.current.setLatLng(position);
    } else {
      // 새 마커 생성
      markerRef.current = L.marker(position)
        .addTo(mapInstanceRef.current)
        .bindPopup(currentElder?.name || '현재 위치');
    }

    // 지도 중심 이동
    mapInstanceRef.current.panTo(position);
  }, [currentLocation, currentElder]);

  // 안전 구역 원 그리기
  useEffect(() => {
    if (!mapInstanceRef.current || !safeZone) return;

    // 기존 원 제거
    if (circleRef.current) {
      circleRef.current.remove();
    }

    // 새 원 생성
    const circle = L.circle([safeZone.center.lat, safeZone.center.lng], {
      radius: safeZone.radius,
      color: '#AE93DF',
      fillColor: '#AE93DF',
      fillOpacity: 0.2,
      weight: 2,
    }).addTo(mapInstanceRef.current);

    circleRef.current = circle;

    // 편집 모드
    if (isEditingZone) {
      // Leaflet에서 원을 드래그/편집하려면 leaflet-editable 등의 플러그인 필요
      // 기본 기능으로는 클릭으로 중심 이동만 구현
      mapInstanceRef.current.on('click', (e: L.LeafletMouseEvent) => {
        setSafeZone({
          center: {
            lat: e.latlng.lat,
            lng: e.latlng.lng,
          },
          radius: safeZone.radius,
        });
      });
    } else {
      mapInstanceRef.current.off('click');
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off('click');
      }
    };
  }, [safeZone, isEditingZone, setSafeZone]);

  const handleSetSafeZone = () => {
    if (currentLocation) {
      setSafeZone({
        center: {
          lat: currentLocation.latitude,
          lng: currentLocation.longitude,
        },
        radius: 500, // 500미터 기본값
      });
      setIsEditingZone(true);
    }
  };

  const handleSaveSafeZone = () => {
    setIsEditingZone(false);
    // TODO: API 호출하여 안전 구역 저장
  };

  const handleRadiusChange = (newRadius: number) => {
    if (safeZone) {
      setSafeZone({
        ...safeZone,
        radius: newRadius,
      });
    }
  };

  const formatAddress = (lat: number, lng: number) => {
    // TODO: Geocoding API를 사용하여 실제 주소로 변환
    return `위도: ${lat.toFixed(6)}, 경도: ${lng.toFixed(6)}`;
  };

  const isOutsideSafeZone = () => {
    if (!currentLocation || !safeZone) return false;

    const distance = calculateDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      safeZone.center.lat,
      safeZone.center.lng
    );

    return distance > safeZone.radius;
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // 지구 반지름 (미터)
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-h1 font-bold text-neutral-gray-dark">위치추적</h1>
        <p className="text-body text-neutral-gray-medium mt-1">
          {currentElder?.name}님의 실시간 위치
        </p>
      </div>

      {/* Alert */}
      {isOutsideSafeZone() && (
        <div className="bg-error/10 border border-error rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-error flex items-center justify-center text-white flex-shrink-0">
              ⚠
            </div>
            <div>
              <h3 className="font-semibold text-error">안전 구역 이탈</h3>
              <p className="text-sm text-neutral-gray-medium mt-1">
                어르신이 설정된 안전 구역을 벗어났습니다. 확인이 필요합니다.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            <div ref={mapRef} className="w-full h-[500px]" />
          </div>
        </div>

        {/* Info Panel */}
        <div className="space-y-4">
          {/* Current Location */}
          <div className="card p-6">
            <h3 className="text-h3 font-semibold text-neutral-gray-dark mb-4">
              현재 위치
            </h3>
            <div className="space-y-3">
              <div>
                <div className="text-caption text-neutral-gray-medium">주소</div>
                <div className="text-sm text-neutral-gray-dark mt-1">
                  {currentLocation
                    ? formatAddress(currentLocation.latitude, currentLocation.longitude)
                    : '위치 정보 없음'}
                </div>
              </div>
              <div>
                <div className="text-caption text-neutral-gray-medium">최종 업데이트</div>
                <div className="text-sm text-neutral-gray-dark mt-1">
                  {currentLocation
                    ? new Date(currentLocation.timestamp).toLocaleString('ko-KR')
                    : '-'}
                </div>
              </div>
              <div>
                <div className="text-caption text-neutral-gray-medium">정확도</div>
                <div className="text-sm text-neutral-gray-dark mt-1">
                  {currentLocation ? `±${currentLocation.accuracy}m` : '-'}
                </div>
              </div>
            </div>
          </div>

          {/* Safe Zone Settings */}
          <Link to="/location/safe-zone" className="p-6">
            <h3 className="text-h3 font-semibold text-neutral-gray-dark mb-4">
              안전 구역 설정
            </h3>
            <div className="space-y-3">
              {safeZone ? (
                <>
                  <div>
                    <div className="text-caption text-neutral-gray-medium">반경</div>
                    <div className="text-sm text-neutral-gray-dark mt-1">
                      {safeZone.radius.toFixed(0)}m
                    </div>
                  </div>
                  {isEditingZone && (
                    <div>
                      <label className="text-caption text-neutral-gray-medium">
                        반경 조정 (m)
                      </label>
                      <input
                        type="range"
                        min="100"
                        max="2000"
                        step="50"
                        value={safeZone.radius}
                        onChange={(e) => handleRadiusChange(Number(e.target.value))}
                        className="w-full mt-2"
                      />
                      <p className="text-xs text-neutral-gray-medium mt-1">
                        지도를 클릭하여 중심 위치를 변경할 수 있습니다.
                      </p>
                    </div>
                  )}
                  {isEditingZone ? (
                    <div className="space-y-2">
                      <button onClick={handleSaveSafeZone} className="btn-primary w-full">
                        저장
                      </button>
                      <button
                        onClick={() => setIsEditingZone(false)}
                        className="btn-secondary w-full"
                      >
                        취소
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsEditingZone(true)}
                      className="btn-secondary w-full"
                    >
                      수정
                    </button>
                  )}
                </>
              ) : (
                <button onClick={handleSetSafeZone} className="btn-primary w-full">
                  안전 구역 설정
                </button>
              )}
            </div>
          </Link>

          {/* Location History */}
          <div className="card p-6">
            <h3 className="text-h3 font-semibold text-neutral-gray-dark mb-4">
              최근 방문 장소
            </h3>
            <div className="space-y-2">
              {locationHistory && locationHistory.length > 0 ? (
                locationHistory.slice(0, 5).map((location) => (
                  <div
                    key={location.location_id}
                    className="text-sm text-neutral-gray-medium border-b border-gray-100 pb-2"
                  >
                    <div>{formatAddress(location.latitude, location.longitude)}</div>
                    <div className="text-xs text-neutral-gray-medium">
                      {new Date(location.timestamp).toLocaleString('ko-KR')}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-neutral-gray-medium">방문 기록이 없습니다.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}