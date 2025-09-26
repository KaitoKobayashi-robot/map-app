"use client";

import { useState, useEffect } from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Location } from "@/types/location";
import LocationList from "./components/control-panel/LocationList";
import LocationItem from "./components/control-panel/LocationItem";
import SubmitButton from "./components/control-panel/SubmitButton";
import ResetButton from "./components/control-panel/ResetButton";

const ControlPanelApp = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // locationsコレクションをリアルタイム監視
  useEffect(() => {
    const locationsColRef = collection(db, "locations");
    const unsubscribeLocations = onSnapshot(locationsColRef, querySnapshot => {
      const locationsData = querySnapshot.docs.map(doc => ({
        ...(doc.data() as Omit<Location, "id">),
        id: doc.id,
      }));
      setLocations(locationsData);
    });

    const highlightDocRef = doc(db, "highlight_status", "current");
    const unsubscribeHighlight = onSnapshot(highlightDocRef, docSnap => {
      if (docSnap.exists()) {
        const highlightData = docSnap.data();
        // highlightedIdsフィールドが存在すれば、選択状態にセット
        if (highlightData?.highlightedIds) {
          setSelectedIds(highlightData.highlightedIds);
        }
      } else {
        // ドキュメントが存在しない場合は選択をクリア
        setSelectedIds([]);
      }
    });

    return () => {
      unsubscribeLocations();
      unsubscribeHighlight();
    };
  }, []);

  const handleToggleSelection = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleResetSelection = async () => {
    setIsResetting(true);
    try {
      const response = await fetch("/api/highlight", {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("API request failed");

      const result = await response.json();
      console.log("API Success:", result.message);
    } catch (error) {
      console.error(error);
      alert("リセットに失敗しました。");
    } finally {
      setIsResetting(false);
    }
  };

  const handleSubmitHighlight = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/highlight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      if (!response.ok) throw new Error("API request failed");

      const result = await response.json();
      console.log("API Success:", result.message);
    } catch (error) {
      console.error(error);
      alert("更新に失敗しました。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">泥棒操作パネル</h1>
      <div className="bg-white shadow-md rounded p-6">
        <h2 className="text-xl mb-4">マーカーを選択</h2>
        <LocationList
          locations={locations}
          selectedIds={selectedIds}
          onToggleSelection={handleToggleSelection}
        />
        <SubmitButton
          isSubmitting={isSubmitting}
          onClick={handleSubmitHighlight}
        />
        <ResetButton onClick={handleResetSelection} isResetting={isResetting} />
      </div>
    </div>
  );
};

export default ControlPanelApp;
