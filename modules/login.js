async function login(page, username, password) {
  await page.goto("https://dbcrm.mavi.web.tr/crm_test/", {
    waitUntil: "networkidle2",
  });
  console.log("🔑 Login ekranı açıldı");

  await page.type("#input_kullanici", username);
  await page.type('input[name="input_sifre"]', password);

  await Promise.all([
    page.click('button[name="submit_giris"]'),
    page.waitForNavigation({ waitUntil: "networkidle2" }),
  ]);
  console.log("✅ Giriş yapıldı");
}

module.exports = login;
