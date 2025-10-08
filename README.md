# Mavi CRM Rapor Otomasyonu

Bu proje, **Mavi CRM** üzerinden günlük faaliyet raporlarını otomatik olarak indirip belirlediğiniz alıcılara e-posta olarak gönderen bir **Node.js otomasyon** sistemidir.

## Özellikler

* CRM’e otomatik giriş yapar.
* Günlük raporları Excel formatında indirir.
* İndirilen raporu belirlenen kullanıcıya e-posta ile gönderir.
* Eski dosyaları temizler (varsayılan 7 gün).
* Otomatik zamanlayıcı ile günlük belirlenen saatte çalışır.
* Türkçe karakterler ve Excel uyumluluğu sağlanmıştır.

## Gereksinimler

* Node.js >= 18
* npm veya yarn
* Puppeteer (Chrome otomasyonu için)
* .env dosyası

## Kurulum

1. Depoyu klonlayın:

```bash
git clone https://github.com/yigithanoguz/mavi_report_automation.git
cd mavi_report_automation
```

2. Bağımlılıkları yükleyin:

```bash
npm install
# veya
yarn install
```

3. `.env` dosyasını oluşturun ve aşağıdaki değişkenleri ekleyin:

```env
CRM_USER=username
CRM_PASS=password
MAIL_TO=username1,username2
REPORT_TIME=18:30
```

* `CRM_USER` → CRM kullanıcı adı
* `CRM_PASS` → CRM şifresi
* `MAIL_TO` → Raporun gönderileceği kullanıcılar, virgül ile ayrılmış
* `REPORT_TIME` → Raporun gönderileceği saat (örn. `18:30`)

## Kullanım

Projeyi çalıştırmak için:

```bash
node app.js
```

* Sunucu başladığında günlük log basar.
* Belirlenen saatte otomatik olarak raporu indirip mail gönderir.
* Hatalarda otomasyon tekrar denenir.

### Manuel Çalıştırma

Otomasyonu zamanlayıcıya bağlı olmadan hemen çalıştırmak için:

```bash
node -e "require('./app').runAutomation()"
```

## Klasör Yapısı

```
Rapor_Otomasyon/
│
├─ app.js              # Ana uygulama ve zamanlayıcı
├─ modules/
│  ├─ login.js         # CRM login modülü
│  ├─ downloadReport.js# Rapor indirme modülü
│  ├─ sendMail.js      # Mail gönderme modülü
│  ├─ cleanup.js       # Eski dosyaları temizleme
│  └─ dailyLogger.js   # Günlük log ve cron ayarları
├─ downloads/          # İndirilen raporlar burada saklanır
├─ package.json
└─ .env                # Ortam değişkenleri
```

## Notlar

* Otomasyon **headless Chrome** kullanır, istenirse `app.js` içinde `headless` modunu değiştirebilirsiniz.
* Rapor dosyaları UTF-8 olarak kaydedilir, Türkçe karakter uyumludur.
* Hatalı durumlarda otomasyon tekrar çalışır.

## Lisans

Bu proje kişisel kullanım ve geliştirme amaçlıdır.