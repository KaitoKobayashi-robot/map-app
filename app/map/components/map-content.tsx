"use client";

import { useState, useEffect } from "react";
import { Map, AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import type { Location } from "@/types/location";

type MapViewProps = {
  allLocations: Location[];
  highlightedIds: string[];
  highlightedPath: { lat: number; lng: number }[];
};

export const MapView = ({
  allLocations,
  highlightedIds,
  highlightedPath,
}: MapViewProps) => {
  const map = useMap();
  const [polyline, setPolyline] = useState<google.maps.Polyline | null>(null);

  // Polylineの描画と更新を管理
  useEffect(() => {
    if (!map) return;

    // Polylineが未作成の場合、インスタンスを生成
    if (!polyline) {
      const newPolyline = new google.maps.Polyline({
        path: highlightedPath,
        strokeColor: "#0000FF",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        icons: [
          {
            icon: { path: "M 0,-1 0,1", strokeOpacity: 1, scale: 4 },
            offset: "0",
            repeat: "20px",
          },
        ],
      });
      newPolyline.setMap(map);
      setPolyline(newPolyline);
    } else {
      // 既にPolylineが存在する場合はパスを更新
      polyline.setPath(highlightedPath);
      // 表示/非表示の切り替え
      polyline.setVisible(highlightedPath.length > 1);
    }

    // コンポーネントのアンマウント時にPolylineをマップから削除
    return () => {
      polyline?.setMap(null);
    };
  }, [map, highlightedPath, polyline]);

  return (
    <Map
      defaultCenter={{ lat: 35.681236, lng: 139.767125 }} // 東京駅
      defaultZoom={12}
      mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID} // Map IDの利用を推奨
      style={{ width: "100%", height: "100vh" }}
      gestureHandling={"greedy"} // スムーズな操作のため
    >
      {allLocations.map(loc => {
        const isHighlighted = highlightedIds.includes(loc.id);
        return (
          <AdvancedMarker
            key={loc.id}
            position={{ lat: loc.lat, lng: loc.lng }}
            title={loc.name}
          >
            {/* AdvancedMarkerでは子要素としてカスタムアイコンを指定します */}
            <img
              src={
                isHighlighted
                  ? "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" // 例: ハイライト用アイコン
                  : "http://maps.google.com/mapfiles/ms/icons/red-dot.png" // 例: 通常用アイコン
              }
              width={isHighlighted ? 48 : 32}
              height={isHighlighted ? 48 : 32}
              alt={loc.name}
            />
          </AdvancedMarker>
        );
      })}
    </Map>
  );
};
