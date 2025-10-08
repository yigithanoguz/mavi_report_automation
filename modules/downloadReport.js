const fs = require("fs-extra");
const path = require("path");
const dayjs = require("dayjs");

async function downloadReport(page, downloadPath) {
  const today = dayjs().format("DD/MM/YYYY");
  const url = `https://dbcrm.mavi.web.tr/crm_test/raporlar/view/raporlar.php?bolum=21&sekme1=2O&islem1=2&id=50&btarih=${encodeURIComponent(
    today
  )}&etarih=${encodeURIComponent(
    today
  )}&departman=0&kullanici=yigithan&listele=Listele`;

  console.log("🔗 Sayfa açılıyor:", url);
  await page.goto(url, { waitUntil: "networkidle2" });

  console.log("📥 Excel tablosu alınıyor...");
  const html = await page.evaluate(() => {
    const table = document.getElementById("table");
    return `<html><head><meta charset="UTF-8"></head><body>${table.outerHTML}</body></html>`;
  });

  await fs.ensureDir(downloadPath);
  const safeFileName = `Gunluk_Faaliyet_Raporu_Rasim_Yigithan_OGUZ_${dayjs().format(
    "YYYYMMDD"
  )}.xls`;
  const filePath = path.join(downloadPath, safeFileName);

  await fs.writeFile(filePath, html, "utf8");
  console.log("✅ Dosya kaydedildi:", filePath);

  return filePath;
}

module.exports = downloadReport;
