"use client";

import { useCallback, useRef } from "react";
import { toast } from "sonner";

export type ExportFormat = "csv" | "xlsx";

const WORKER_PATH = "/export.worker.js";

export function useExportWorker() {
  const workerRef = useRef<Worker | null>(null);
  const idRef = useRef(0);

  const getWorker = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!workerRef.current) {
      workerRef.current = new Worker(WORKER_PATH);
    }
    return workerRef.current;
  }, []);

  const exportToFile = useCallback(
    (params: {
      data: Record<string, unknown>[];
      format: ExportFormat;
      filename: string;
      sheetName?: string;
    }): Promise<void> => {
      const { data, format, filename, sheetName } = params;
      const worker = getWorker();
      if (!worker) {
        toast.error("Export not supported in this environment");
        return Promise.resolve();
      }
      const toastId = toast.loading("Exporting…");
      return new Promise((resolve, reject) => {
        const id = ++idRef.current;
        const onMessage = (e: MessageEvent) => {
          if (e.data?.id !== id) return;
          worker.removeEventListener("message", onMessage);
          worker.removeEventListener("error", onError);
          if (e.data.error) {
            toast.error(e.data.error, { id: toastId });
            reject(new Error(e.data.error));
            return;
          }
          const blob = e.data.blob as Blob | undefined;
          const name = e.data.filename as string | undefined;
          if (blob && name) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = name;
            a.click();
            URL.revokeObjectURL(url);
            toast.success("Export downloaded", { id: toastId });
          }
          resolve();
        };
        const onError = () => {
          worker.removeEventListener("message", onMessage);
          worker.removeEventListener("error", onError);
          toast.error("Export failed", { id: toastId });
          reject(new Error("Worker error"));
        };
        worker.addEventListener("message", onMessage);
        worker.addEventListener("error", onError);
        worker.postMessage({ id, type: format, data, filename, sheetName });
      });
    },
    [getWorker]
  );

  return { exportToFile };
}
