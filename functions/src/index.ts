import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { setGlobalOptions } from "firebase-functions/v2";
import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

import cors from "cors";

setGlobalOptions({ region: "asia-northeast1" });

initializeApp();
const db = getFirestore();

const corsHandler = cors({ origin: true });

export const highlightMarker = onRequest(async (request, response) => {
  corsHandler(request, response, async () => {
    if (request.method !== "POST") {
      response.status(405).send("Method Not Allowed");
      return;
    }
    try {
      const { ids } = request.body;

      if (!Array.isArray(ids)) {
        response
          .status(400)
          .send("Invalid request body: 'ids' must be an array.");
        return;
      }

      const highlightRef = db.collection("highlight_status").doc("current");

      await highlightRef.set({
        highlightedIds: ids,
        updatedAt: FieldValue.serverTimestamp(),
      });

      logger.info(`Successfully updated highlighted IDs: ${ids.join(", ")}`);
      response.status(200).json({
        success: true,
        message: `Highlighted IDs updated successfully.`,
      });
    } catch (error) {
      logger.error("Error updating hightlight status: ", error);
      response.status(500).send("Internal Server Error");
    }
  });
});
