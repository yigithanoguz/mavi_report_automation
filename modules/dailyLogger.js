const dayjs = require("dayjs");
const cron = require("node-cron");

const [hour, minute] = process.env.REPORT_TIME.split(":");

function logTodayInfo() {
  const now = dayjs();
  const formattedDate = now.format("DD/MM/YYYY dddd"); // örn: 07/10/2025 Salı
  console.log(`📅 Bugün ${formattedDate}`);

  const targetTime = now.hour(hour).minute(minute);
  if (now.isBefore(targetTime)) {
    console.log(`⏰ Saat ${hour}.${minute}'da mail gönderilecek`);
  } else {
    console.log(
      `⏰ Saat ${hour}.${minute} geçti, bir sonraki gün mail gönderilecek`
    );
  }
}

async function errorInfo(callback) {
  console.log("🚀 Bir hata alındı. İşlem tekrar başlatılıyor...");
  if (callback && typeof callback === "function") {
    await callback();
  }
}

function start() {
  console.log("🚀 Sunucu çalışıyor...");
  logTodayInfo(process.env.REPORT_TIME);

  // Her gün 00:00'da güncelle
  cron.schedule("0 0 * * *", () => logTodayInfo());
}

// Dinamik zaman planlayıcı
function scheduleAtTime(callback) {
  const cronExp = `${minute} ${hour} * * *`;
  cron.schedule(
    cronExp,
    async () => {
      console.log(`🕕 Saat ${hour}:${minute} oldu, otomasyon başlıyor...`);
      await callback();
    },
    {
      scheduled: true,
      recoverMissedExecutions: true,
    }
  );
}

module.exports = { start, scheduleAtTime, errorInfo };