const axios = require("axios");
const cheerio = require("cheerio");

const scrapeMevduatData = async () => {
  const url = "https://www.hesapkurdu.com/mevduat";

  try {
    // Sayfayı Axios ile al
    const { data } = await axios.get(url);

    // Cheerio ile HTML'yi yükle
    const $ = cheerio.load(data);

    const mevduatData = [];

    // Tablo satırlarını seç ve verileri çek
    $("table#components-flat-table-flat-table tbody tr").each((index, element) => {
      // Banka adı (img alt özelliği)
      const bankaAdi = $(element)
        .find("td.flat-table_table-body--image__sE94Y img")
        .attr("alt");

      // Ürün adı
      const urunAdi = $(element)
        .find("td.flat-table_table-body--item__D5Bkf")
        .eq(0) // Ürün adı, ilk sütundan sonra gelir
        .text()
        .trim();

      // Faiz oranı
      let faizOrani = $(element)
        .find("td.flat-table_table-body--item__D5Bkf")
        .eq(1) // Faiz oranı, ikinci sütunda
        .text()
        .trim();

      // Faiz oranındaki "%" işaretini kaldır ve sayıya çevir
      if (faizOrani) {
        faizOrani = parseFloat(faizOrani.replace("%", "").replace(",", "."));
      }

      // Banka adı, ürün adı ve faiz oranı varsa listeye ekle
      if (bankaAdi && urunAdi && faizOrani) {
        mevduatData.push({
          bankaAdi,
          urunAdi,
          faizOrani,
        });
      }
    });

    // Eğer veri çekilemezse, uyarı ver
    if (mevduatData.length === 0) {
      console.error("Hiçbir veri çekilemedi. Tablo yapısını kontrol edin.");
    }

    return mevduatData;
  } catch (error) {
    console.error("Scraper Hatası:", error);
    return [];
  }
};

// Scraper'ı çalıştır
scrapeMevduatData()
  .then((data) => console.log("Mevduat Verileri:", data))
  .catch((error) => console.error("Hata:", error));

module.exports = scrapeMevduatData;
