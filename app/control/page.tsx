"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Location } from "@/types/location";

const ControlPanelApp = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // locationsコレクションをリアルタイム監視
  useEffect(() => {
    const locationsColRef = collection(db, "locations");
    const unsubscribe = onSnapshot(locationsColRef, querySnapshot => {
      const locationsData = querySnapshot.docs.map(
        doc => doc.data() as Location
      );
      setLocations(locationsData);
    });
    return () => unsubscribe();
  }, []);

  const handleToggleSelection = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
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
      alert("ハイライトを更新しました！");
    } catch (error) {
      console.error(error);
      alert("更新に失敗しました。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">操作パネル</h1>
      <div className="bg-white shadow-md rounded p-6">
        <h2 className="text-xl mb-4">マーカーを選択してください</h2>
        <div className="space-y-2 mb-6">
          {locations.map(loc => (
            <button
              key={loc.id}
              onClick={() => handleToggleSelection(loc.id)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                selectedIds.includes(loc.id)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {loc.name}
            </button>
          ))}
        </div>
        <button
          onClick={handleSubmitHighlight}
          disabled={isSubmitting}
          className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 disabled:bg-gray-400"
        >
          {isSubmitting ? "更新中..." : "ハイライトを更新"}
        </button>
      </div>
    </div>
  );
};

export default ControlPanelApp;
