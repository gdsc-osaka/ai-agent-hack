import {onSchedule} from "firebase-functions/v2/scheduler";
import {logger} from "firebase-functions";
import {ServicesClient} from "@google-cloud/run";

const runClient = new ServicesClient();

const PROJECT_ID =
  process.env.GCLOUD_PROJECT || "YOUR_PROJECT_ID";
const REGION = "asia-northeast1"; // e.g., "us-central1", "asia-northeast1"
const SERVICE_NAME_PREFIX = "recall-you-api-preview-";
const DAYS_THRESHOLD = 3; // 削除対象とする経過日数 (3日)

exports.previewCleanup = onSchedule(
  "every day 00:00",
  async () => {
    logger.info(
      "🚀 Starting Cloud Run preview cleanup job...",
      {
        project: PROJECT_ID,
        region: REGION,
      }
    );

    const parent = `projects/${PROJECT_ID}/locations/${REGION}`;

    try {
      // 指定リージョンの全サービスを取得
      const [services] = await runClient.listServices({
        parent,
      });

      if (!services || services.length === 0) {
        logger.info(
          "✅ No Cloud Run services found in this region. Exiting."
        );
        return;
      }

      const now = new Date();
      // 3日前の日時を計算
      const thresholdDate = new Date(
        now.getTime() - DAYS_THRESHOLD * 24 * 60 * 60 * 1000
      );

      logger.info(
        `Threshold for deletion: services updated before ${thresholdDate.toISOString()}`
      );

      // 並列で削除処理を実行するためのPromise配列
      const deletionPromises: Promise<void>[] = [];

      for (const service of services) {
        // サービス名と更新日時がなければスキップ
        if (!service.name || !service.updateTime?.seconds) {
          continue;
        }

        const serviceId =
          service.name.split("/").pop() || "";
        const updateTime = new Date(
          Number(service.updateTime.seconds) * 1000
        );

        // サービス名がプレフィックスに一致し、かつ最終更新日時が閾値より古いかチェック
        if (
          serviceId.startsWith(SERVICE_NAME_PREFIX) &&
          updateTime < thresholdDate
        ) {
          logger.info(
            `[DELETE TARGET] Found old service: ${serviceId} (Last updated: ${updateTime.toISOString()})`
          );

          const deletePromise = runClient
            .deleteService({name: service.name})
            .then(() => {
              logger.info(
                `✅ Successfully deleted service: ${serviceId}`
              );
            })
            .catch((error) => {
              logger.error(
                `❌ Failed to delete service: ${serviceId}`,
                error
              );
            });

          deletionPromises.push(deletePromise);
        } else if (
          serviceId.startsWith(SERVICE_NAME_PREFIX)
        ) {
          logger.info(
            `[SKIP] Service is not old enough: ${serviceId} (Last updated: ${updateTime.toISOString()})`
          );
        }
      }

      // すべての削除処理が完了するのを待つ
      await Promise.all(deletionPromises);

      logger.info(
        "🎉 Cloud Run preview cleanup job finished successfully."
      );
    } catch (error) {
      logger.error(
        "☠️ An error occurred during the Cloud Run cleanup job.",
        error
      );
    }
  }
);
