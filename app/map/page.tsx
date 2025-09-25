"use client";

import { useState, useEffect, useMemo } from "react";
import {
  LoadScript,
  GoogleMap,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import { doc, onSnapshot, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Firebase初期化ファイル
import type { Location } from "@/types/location";

const MapApp = () => {
  const [allLocations, setAllLocations] = useState<Location[]>([]);
  const [highlightedIds, setHighlightedIds] = useState<string[]>([]);

  // 1. 初回にすべてのマーカー情報を取得
  useEffect(() => {
    const fetchAllLocations = async () => {
      const querySnapshot = await getDocs(collection(db, "locations"));
      setAllLocations(querySnapshot.docs.map(doc => doc.data() as Location));
    };
    fetchAllLocations();
  }, []);

  // 2. ハイライト状態をリアルタイムで監視
  useEffect(() => {
    const highlightDocRef = doc(db, "highlight_status", "current");

    const unsubscribe = onSnapshot(highlightDocRef, docSnap => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setHighlightedIds(data.highlightedIds || []);
        console.log("Highlight status updated:", data.highlightedIds);
      }
    });

    // コンポーネントがアンマウントされたら監視を解除
    return () => unsubscribe();
  }, []);

  // ハイライトされたマーカーの座標リストを計算
  const highlightedPath = useMemo(() => {
    return allLocations
      .filter(loc => highlightedIds.includes(loc.id))
      .map(loc => ({ lat: loc.lat, lng: loc.lng }));
  }, [allLocations, highlightedIds]);

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100vh" }}
        center={{ lat: 35.681236, lng: 139.767125 }} // 東京駅
        zoom={12}
      >
        {allLocations.map(loc => (
          <Marker
            key={loc.id}
            position={{ lat: loc.lat, lng: loc.lng }}
            title={loc.name}
            icon={{
              url: highlightedIds.includes(loc.id)
                ? "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png" // ハイライト
                : "http://maps.google.com/mapfiles/ms/icons/red-dot.png", // 通常
              scaledSize: new window.google.maps.Size(
                highlightedIds.includes(loc.id) ? 48 : 32,
                highlightedIds.includes(loc.id) ? 48 : 32
              ),
            }}
          />
        ))}

        {highlightedPath.length > 1 && (
          <Polyline
            path={highlightedPath}
            options={{
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
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapApp;
