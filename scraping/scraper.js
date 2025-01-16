const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeFaizOranlari() {
    try {
        // Web sayfasının URL'si
        const url = 'https://www.hesapkurdu.com/kredi';
        const { data } = await axios.get(url); // Sayfa HTML'sini çek
        const $ = cheerio.load(data); // Cheerio ile HTML'yi yükle

        const faizOranlari = [];

        // Tablodaki her satırı seçiyoruz
        $('tbody tr').each((index, element) => {
            const bankaAdi = $(element).find('img').attr('alt'); // Banka adı (img alt özelliği)
            let faizOrani = $(element).find('td').eq(1).text().trim(); // Faiz oranı (2. sütun)

            // Faiz oranındaki "%" işaretini kaldır ve sayıya çevir
            if (faizOrani) {
                faizOrani = parseFloat(faizOrani.replace('%', '').replace(',', '.'));
            }

            // Banka adı ve faiz oranı varsa listeye ekle
            if (bankaAdi && faizOrani) {
                faizOranlari.push({
                    bankaAdi,
                    faizOrani,
                });
            }
        });

        // Eğer hiçbir veri çekilmediyse, hatayı bildir
        if (faizOranlari.length === 0) {
            console.error('Hiçbir veri çekilemedi. Sayfa yapısını kontrol edin.');
        }

        return faizOranlari; // Çekilen veriyi döndür
    } catch (error) {
        console.error('Scraper Hatası:', error);
        return [];
    }
}

module.exports = scrapeFaizOranlari;
