"use client";

import { useState, useEffect, useMemo } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import { doc, onSnapshot, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Firebase初期化ファイル
import type { Location } from "@/types/location";
import { MapView } from "@/app/map/components/map-content";
import { QuerySnapshot } from "firebase-admin/firestore";

const MapApp = () => {
  const [allLocations, setAllLocations] = useState<Location[]>([]);
  const [highlightedIds, setHighlightedIds] = useState<string[]>([]);

  // 1. 初回にすべてのマーカー情報を取得 (変更なし)
  useEffect(() => {
    const locationsColRef = collection(db, "locations");
    const unsubscribe = onSnapshot(locationsColRef, querySnapshot => {
      const locationsData = querySnapshot.docs.map(doc => ({
        ...(doc.data() as Omit<Location, "id">),
        id: doc.id,
      }));
      setAllLocations(locationsData);
    });
    return () => unsubscribe();
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

    return () => unsubscribe();
  }, []);

  // ハイライトされたマーカーの座標リストを計算
  const highlightedPath = useMemo(() => {
    // 順番を保持したい場合は、IDリストの順序に合わせてソートするなどの処理を追加
    return allLocations
      .filter(loc => highlightedIds.includes(loc.id))
      .map(loc => ({ lat: loc.lat, lng: loc.lng }));
  }, [allLocations, highlightedIds]);

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <MapView
        allLocations={allLocations}
        highlightedIds={highlightedIds}
        highlightedPath={highlightedPath}
      />
    </APIProvider>
  );
};

export default MapApp;
