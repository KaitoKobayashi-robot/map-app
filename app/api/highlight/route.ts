import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";

// Firebase Admin SDKを初期化
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
    const { ids } = body;

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json(
        { message: 'Invalid request body. "ids" array is required.' },
        { status: 400 }
      );
    }

    // Firestoreの 'highlight_status' コレクションにある 'current' ドキュメントを更新
    const highlightRef = db.collection("highlight_status").doc("current");
    await highlightRef.set({
      highlightedIds: ids,
      updatedAt: new Date(), // Admin SDKでは new Date() を使用
    });

    return NextResponse.json(
      {
        success: true,
        message: `Highlighted IDs updated to: ${ids.join(", ")}`,
      },
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
    // Firestoreの 'highlight_status' コレクションにある 'current' ドキュメントを更新
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
