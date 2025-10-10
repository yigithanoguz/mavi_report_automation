require("dotenv").config();
const puppeteer = require("puppeteer");
const path = require("path");

const dailyLogger = require("./modules/dailyLogger");
const login = require("./modules/login");
const downloadReport = require("./modules/downloadReport");
const sendMail = require("./modules/sendMail");
const cleanupOldFiles = require("./modules/cleanup");

const downloadPath = path.resolve(__dirname, "downloads");

// Otomasyon fonksiyonu
async function runAutomation() {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    args: ["--start-maximized"],
  });

  const page = await browser.newPage();

  try {
    await login(page, process.env.CRM_USER, process.env.CRM_PASS);
    await cleanupOldFiles(downloadPath, 7);
    const filePath = await downloadReport(page, downloadPath);
    await sendMail(page, filePath);
  } catch (err) {
    console.log("❌ Hata:", err);
    console.log("🚀 Hata alındı, otomasyon tekrar başlatılıyor...");
    await runAutomation();
  } finally {
    await browser.close();
  }
}

// Günlük log ve 00:00 cron
dailyLogger.start();

// 18:30 cron ile otomasyonu tetikle
dailyLogger.scheduleAtTime(runAutomation);
