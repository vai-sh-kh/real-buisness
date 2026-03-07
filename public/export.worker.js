/* global XLSX */
const SCRIPT_URL = "https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js";
let libLoaded = false;

function loadScript() {
  return new Promise((resolve, reject) => {
    if (typeof XLSX !== "undefined") {
      libLoaded = true;
      resolve();
      return;
    }
    importScripts(SCRIPT_URL);
    libLoaded = true;
    resolve();
  });
}

self.onmessage = async function (e) {
  const { id, type, data, filename, sheetName } = e.data || {};
  if (!id || !type || !Array.isArray(data)) {
    self.postMessage({ id, error: "Invalid message: id, type, and data (array) required" });
    return;
  }
  try {
    await loadScript();
    const ws = XLSX.utils.json_to_sheet(data);
    const baseName = filename || "export";
    let blob;
    let finalFilename = baseName;
    if (type === "csv") {
      const csv = XLSX.utils.sheet_to_csv(ws);
      blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
      if (!finalFilename.toLowerCase().endsWith(".csv")) finalFilename += ".csv";
    } else {
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, sheetName || "Sheet1");
      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      if (!finalFilename.toLowerCase().endsWith(".xlsx")) finalFilename += ".xlsx";
    }
    self.postMessage({ id, blob, filename: finalFilename });
  } catch (err) {
    self.postMessage({ id, error: err && err.message ? err.message : "Export failed" });
  }
};
