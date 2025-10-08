async function sendMail(page, filePath) {
  console.log("📧 Mail sayfası açılıyor...");
  await page.goto("https://dbcrm.mavi.web.tr/crm_test/", {
    waitUntil: "networkidle2",
  });
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const mailFrame = page
    .frames()
    .find((f) => f.url().includes("mail_local/list/mail_local_kontrol.php"));
  if (!mailFrame) throw new Error("Mail iframe bulunamadı!");

  await mailFrame.waitForSelector(
    "body > table > tbody > tr > td:nth-child(2) > a",
    { timeout: 5000 }
  );
  const mailButton = await mailFrame.$(
    "body > table > tbody > tr > td:nth-child(2) > a"
  );
  await mailButton.click();

  const popup = await new Promise((resolve) =>
    page
      .browser()
      .once("targetcreated", async (target) => resolve(await target.page()))
  );
  await popup.bringToFront();

  await popup.waitForSelector('select[name="sablon"]');
  await popup.select('select[name="sablon"]', "1574");
  await popup.on("dialog", async (dialog) => await dialog.accept());
  await popup.click('input[name="sablondan_olustur"]');

  await popup.waitForSelector('button[name="kaydet"]');
  await popup.click('button[name="kaydet"]');

  // DOM reload bekle
  await popup.waitForFunction(() => document.readyState === "complete");
  console.log("✅ Şablon oluşturuldu ve DOM yüklendi");

  const mailContentFrame = popup
    .frames()
    .find((f) => f.url().includes("mail_local_gonder.php"));
  if (!mailContentFrame) {
    console.error("❌ Mail gönderme frame bulunamadı!");
    await browser.close();
    return;
  }

  await mailContentFrame.waitForSelector("#ffile");
  const fileInput = await mailContentFrame.$("#ffile");
  await fileInput.uploadFile(filePath);
  await mailContentFrame.click('input[name="attach_add"]');

  const mailToArray = process.env.MAIL_TO.split(",");

  await mailToArray.reduce((promise, to) => {
    return promise.then(async () => {
      await mailContentFrame.waitForSelector("select#kullanici", {
        timeout: 10000,
      });
      await mailContentFrame.select("select#kullanici", to);
      await mailContentFrame.click('button[name="kaydet_to"]');
      await new Promise((resolve) => setTimeout(resolve, 3000));
    });
  }, Promise.resolve());

  console.log("✅ Kullanıcı seçildi");

  await mailContentFrame.click('button[name="gonder"]');
  await new Promise((resolve) => setTimeout(resolve, 3000));
  console.log("📨 Mail gönderildi!");
}

module.exports = sendMail;
