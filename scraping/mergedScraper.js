const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');

// MongoDB Atlas Bağlantısı
mongoose.connect('mongodb+srv://ibrahimgezmis92:FpWLRa24p6h8Q96Q@cluster0.e6koq.mongodb.net/finans?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Atlas bağlantısı başarılı!'))
  .catch(err => console.error('MongoDB bağlantı hatası:', err));

// MongoDB Şema ve Modeller
const KrediSchema = new mongoose.Schema({
  bankaAdi: String,
  faizOrani: Number,
  tarih: { type: Date, default: Date.now },
});

const MevduatSchema = new mongoose.Schema({
  bankaAdi: String,
  urunAdi: String,
  faizOrani: Number,
  tarih: { type: Date, default: Date.now },
});

const KrediModel = mongoose.model('Kredi', KrediSchema);
const MevduatModel = mongoose.model('Mevduat', MevduatSchema);

// Kredi Faiz Oranları Scraper
async function scrapeKrediFaizOranlari() {
  try {
    const url = 'https://www.hesapkurdu.com/kredi';
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const faizOranlari = [];

    $('tbody tr').each((index, element) => {
      const bankaAdi = $(element).find('img').attr('alt');
      let faizOrani = $(element).find('td').eq(1).text().trim();

      if (faizOrani) {
        faizOrani = parseFloat(faizOrani.replace('%', '').replace(',', '.'));
      }

      if (bankaAdi && faizOrani) {
        faizOranlari.push({ bankaAdi, faizOrani });
      }
    });

    if (faizOranlari.length === 0) {
      console.error('Hiçbir kredi faiz oranı çekilemedi.');
      return;
    }

    for (const kredi of faizOranlari) {
      // Duplike kontrolü
      const mevcutKredi = await KrediModel.findOne({ bankaAdi: kredi.bankaAdi, faizOrani: kredi.faizOrani });
      if (!mevcutKredi) {
        const yeniKredi = new KrediModel(kredi);
        await yeniKredi.save();
      } else {
        console.log(`Zaten mevcut: ${kredi.bankaAdi} - ${kredi.faizOrani}`);
      }
    }

    console.log('Kredi faiz oranları MongoDB\'ye başarıyla kaydedildi!');
  } catch (error) {
    console.error('Kredi Scraper Hatası:', error.message);
  }
}

// Mevduat Faiz Oranları Scraper
async function scrapeMevduatFaizOranlari() {
  try {
    const url = 'https://www.hesapkurdu.com/mevduat';
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const mevduatData = [];

    $('table#components-flat-table-flat-table tbody tr').each((index, element) => {
      const bankaAdi = $(element).find('td.flat-table_table-body--image__sE94Y img').attr('alt');
      const urunAdi = $(element).find('td.flat-table_table-body--item__D5Bkf').eq(0).text().trim();
      let faizOrani = $(element).find('td.flat-table_table-body--item__D5Bkf').eq(1).text().trim();

      if (faizOrani) {
        faizOrani = parseFloat(faizOrani.replace('%', '').replace(',', '.'));
      }

      if (bankaAdi && urunAdi && faizOrani) {
        mevduatData.push({ bankaAdi, urunAdi, faizOrani });
      }
    });

    if (mevduatData.length === 0) {
      console.error('Hiçbir mevduat faiz oranı çekilemedi.');
      return;
    }

    for (const mevduat of mevduatData) {
      // Duplike kontrolü
      const mevcutMevduat = await MevduatModel.findOne({ bankaAdi: mevduat.bankaAdi, urunAdi: mevduat.urunAdi, faizOrani: mevduat.faizOrani });
      if (!mevcutMevduat) {
        const yeniMevduat = new MevduatModel(mevduat);
        await yeniMevduat.save();
      } else {
        console.log(`Zaten mevcut: ${mevduat.bankaAdi} - ${mevduat.urunAdi} - ${mevduat.faizOrani}`);
      }
    }

    console.log('Mevduat faiz oranları MongoDB\'ye başarıyla kaydedildi!');
  } catch (error) {
    console.error('Mevduat Scraper Hatası:', error.message);
  }
}

// Tüm Scraper'ları Çalıştır
async function runScrapers() {
  console.log('Scraper işlemi başlatılıyor...');
  await scrapeKrediFaizOranlari();
  await scrapeMevduatFaizOranlari();
  console.log('Scraper işlemi tamamlandı.');
}

runScrapers();