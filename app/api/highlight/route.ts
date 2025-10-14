import { NextRequest, NextResponse } from "next/server";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";

// Firebase Admin SDKの初期化 (変更なし)
if (!getApps().length) {
  if (process.env.NODE_ENV === "development") {
    const serviceAccount = require("@/serviceAccountKey.json");
    initializeApp({ credential: cert(serviceAccount) });
  } else {
    initializeApp();
  }
}

const db = getFirestore();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { toggledId, isCurrentlySelected } = body;

    if (!toggledId || typeof isCurrentlySelected !== "boolean") {
      return NextResponse.json(
        { message: "Invalid request body." },
        { status: 400 }
      );
    }

    const highlightRef = db.collection("highlight_status").doc("current");

    // isCurrentlySelected が true なら削除、false なら追加する
    const updateData = {
      highlightedIds: isCurrentlySelected
        ? FieldValue.arrayRemove(toggledId) // 配列から要素を削除
        : FieldValue.arrayUnion(toggledId), // 配列に要素を追加
      updatedAt: FieldValue.serverTimestamp(),
    };

    await highlightRef.update(updateData);

    return NextResponse.json(
      { success: true, message: "Highlight status updated efficiently." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating highlight status:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const highlightRef = db.collection("highlight_status").doc("current");
    await highlightRef.update({
      highlightedIds: [],
    });

    return NextResponse.json(
      {
        success: true,
        message: "Highlighted IDs have been reset.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error resetting highlight status:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
