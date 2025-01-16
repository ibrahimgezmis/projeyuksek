const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');

// MongoDB Bağlantısı
mongoose.connect('mongodb://localhost:27017/finans', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB bağlantısı başarılı!'))
  .catch(err => console.error('MongoDB bağlantı hatası:', err));

// MongoDB Şema ve Model
const KrediSchema = new mongoose.Schema({
  faizOrani: String,
  tarih: { type: Date, default: Date.now },
});

const KrediModel = mongoose.model('Kredi', KrediSchema);

// Web Scraping Fonksiyonu
async function scrapeKrediFaizi() {
  try {
    // HangiKredi sayfasını al
    const response = await axios.get('https://www.hangikredi.com/kredi/ihtiyac-kredisi');
    const html = response.data;

    // Cheerio ile DOM analiz et
    const $ = cheerio.load(html);

    // Faiz oranını seç
    const faizOrani = $('.interest-rate .value').first().text().trim();

    console.log('Çekilen Faiz Oranı:', faizOrani);

    // MongoDB'ye kaydet
    const yeniKredi = new KrediModel({ faizOrani });
    await yeniKredi.save();

    console.log('Faiz oranı MongoDB\'ye başarıyla kaydedildi!');
  } catch (error) {
    console.error('Hata:', error.message);
  }
}

// Scraping'i çalıştır
scrapeKrediFaizi();
