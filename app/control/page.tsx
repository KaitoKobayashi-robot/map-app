"use client";

import { useState, useEffect } from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Location } from "@/types/location";
import LocationList from "@/app/control/components/control-panel/LocationList";
import ResetButton from "@/app/control/components/control-panel/ResetButton";

const ControlPanelApp = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

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
      const highlightData = docSnap.exists() ? docSnap.data() : null;
      setSelectedIds(highlightData?.highlightedIds || []);
    });

    return () => {
      unsubscribeLocations();
      unsubscribeHighlight();
    };
  }, []);

  const handleLocationToggle = async (toggledId: string) => {
    // 1. このIDが現在選択されているかどうかを判断
    const isCurrentlySelected = selectedIds.includes(toggledId);

    // 2. APIに送信するデータを変更
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/highlight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toggledId: toggledId,
          isCurrentlySelected: isCurrentlySelected,
        }),
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

  return (
    <div className="container mx-auto p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">泥棒操作パネル</h1>
      <div className="bg-white shadow-md rounded p-6">
        <LocationList
          locations={locations}
          selectedIds={selectedIds}
          onToggleSelection={handleLocationToggle}
        />
        <div className="mt-4">
          <ResetButton
            onClick={handleResetSelection}
            isResetting={isResetting}
          />
        </div>
      </div>
    </div>
  );
};

export default ControlPanelApp;
