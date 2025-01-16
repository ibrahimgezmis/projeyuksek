const express = require('express');
const cors = require('cors'); 
const { scrapeKrediFaizOranlari, scrapeMevduatFaizOranlari } = require('./scraping/mergedScraper'); // mergedScraper.js'teki fonksiyonları içe aktar
const KrediModel = require('./models/Kredi'); // Kredi modelini içe aktar
const MevduatModel = require('./models/Mevduat'); // Mevduat modelini içe aktar

const app = express();
const PORT = 5000;

// CORS ayarları
app.use(cors());

// API endpoint: Kredi faiz oranlarını döndürür
app.get('/api/faiz-oranlari', async (req, res) => {
    try {
        // Veritabanından kredi faiz oranlarını çek
        const faizOranlari = await KrediModel.find({});
        res.json(faizOranlari); // Veriyi JSON olarak döndür
    } catch (error) {
        console.error('API Hatası:', error);
        res.status(500).json({ error: 'Kredi faiz oranları çekilemedi.' });
    }
});

// API endpoint: Mevduat faiz oranlarını döndürür
app.get('/api/mevduat-oranlari', async (req, res) => {
    try {
        // Veritabanından mevduat faiz oranlarını çek
        const mevduatOranlari = await MevduatModel.find({});
        res.json(mevduatOranlari); // Veriyi JSON olarak döndür
    } catch (error) {
        console.error('API Hatası:', error);
        res.status(500).json({ error: 'Mevduat faiz oranları çekilemedi.' });
    }
});

// API endpoint: Scraper'ları manuel çalıştırma
app.get('/api/run-scrapers', async (req, res) => {
    try {
        // Scraper'ları çalıştır
        await scrapeKrediFaizOranlari();
        await scrapeMevduatFaizOranlari();

        res.json({ message: 'Scraper işlemleri başarıyla tamamlandı!' });
    } catch (error) {
        console.error('Scraper Hatası:', error);
        res.status(500).json({ error: 'Scraper işlemleri sırasında hata oluştu.' });
    }
});

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor...`);
});