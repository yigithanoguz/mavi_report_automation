const fs = require("fs-extra");
const path = require("path");
const dayjs = require("dayjs");

async function cleanupOldFiles(downloadPath, days = 7) {
  await fs.ensureDir(downloadPath);
  const files = await fs.readdir(downloadPath);

  for (const file of files) {
    const fullPath = path.join(downloadPath, file);
    const stats = await fs.stat(fullPath);
    if (dayjs(stats.mtime).isBefore(dayjs().subtract(days, "day"))) {
      await fs.remove(fullPath);
      console.log(`🗑️  Silindi: ${file}`);
    }
  }
}

module.exports = cleanupOldFiles;
