import React, { useEffect, useState } from "react";

const KrediHesaplama = () => {
  const [faizOranlari, setFaizOranlari] = useState([]); // Faiz oranlarını tutacak state
  const [activeTab, setActiveTab] = useState("scraper"); // Aktif sekme (scraper veya custom)
  const [selectedFaizOrani, setSelectedFaizOrani] = useState(null); // Seçilen faiz oranı
  const [krediTutari, setKrediTutari] = useState(""); // Kullanıcıdan alınacak kredi tutarı
  const [vade, setVade] = useState(""); // Kullanıcıdan alınacak vade süresi
  const [aylikTaksit, setAylikTaksit] = useState(null); // Hesaplanan aylık taksit
  const [toplamOdeme, setToplamOdeme] = useState(null); // Toplam ödeme
  const [toplamFaiz, setToplamFaiz] = useState(null); // Toplam faiz
  const [customFaizOrani, setCustomFaizOrani] = useState(""); // Kullanıcının girdiği faiz oranı

  // API'den faiz oranlarını çekme
  useEffect(() => {
    const fetchFaizOranlari = async () => {
      try {
        const response = await fetch("/api/faiz-oranlari");
        const data = await response.json();
        console.log("Gelen veri:", data); // Gelen veriyi konsola yazdır
        if (Array.isArray(data)) {
          setFaizOranlari(data); // Eğer veri bir dizi ise doğrudan kaydet
        } else if (data.faizOranlari) {
          setFaizOranlari(data.faizOranlari); // Eğer veri bir nesne ise içindeki diziye eriş
        } else {
          console.error("Beklenmeyen veri formatı:", data);
        }
      } catch (error) {
        console.error("Hata:", error);
      }
    };

    fetchFaizOranlari();
  }, []);

  // Kredi hesaplama işlemi
  const krediHesapla = () => {
    const faizOrani =
      activeTab === "scraper"
        ? parseFloat(selectedFaizOrani) / 100 // Scraper verisi kullanılıyorsa
        : parseFloat(customFaizOrani) / 100; // Kullanıcı kendi faiz oranını girdiyse

    if (!faizOrani || !krediTutari || !vade) {
      alert("Lütfen tüm alanları doldurun!");
      return;
    }

    const aylikFaiz = faizOrani / 12;
    const kredi = parseFloat(krediTutari.replace(/,/g, ""));
    const aySayisi = parseInt(vade);

    const taksit =
      (kredi * aylikFaiz * Math.pow(1 + aylikFaiz, aySayisi)) /
      (Math.pow(1 + aylikFaiz, aySayisi) - 1);
    const toplamOdemeHesapla = taksit * aySayisi;
    const toplamFaizHesapla = toplamOdemeHesapla - kredi;

    setAylikTaksit(taksit.toFixed(2));
    setToplamOdeme(toplamOdemeHesapla.toFixed(2));
    setToplamFaiz(toplamFaizHesapla.toFixed(2));
  };

  // Sayı formatlama (örn. 100000 -> 100,000)
  const formatNumber = (number) => {
    return number.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="container" style={{ textAlign: "center", padding: "20px" }}>
      <h1>Kredi Hesaplama</h1>

      {/* Sekmeler */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <button
          className={`tab-button ${activeTab === "scraper" ? "active" : ""}`}
          onClick={() => setActiveTab("scraper")}
        >
          Scraper Verileri
        </button>
        <button
          className={`tab-button ${activeTab === "custom" ? "active" : ""}`}
          onClick={() => setActiveTab("custom")}
        >
          Kendi Faiz Oranınızı Girin
        </button>
      </div>

      {/* Scraper Sekmesi */}
      {activeTab === "scraper" && (
        <div>
          <label htmlFor="faizOrani">Faiz Oranı Seçiniz:</label>
          <select
            id="faizOrani"
            className="input"
            onChange={(e) => setSelectedFaizOrani(e.target.value)}
          >
            <option value="">Faiz oranı seçin</option>
            {Array.isArray(faizOranlari) &&
              faizOranlari.map((item, index) => (
                <option key={index} value={item.faizOrani}>
                  {item.bankaAdi} - {item.faizOrani}%
                </option>
              ))}
          </select>
        </div>
      )}

      {/* Kendi Faiz Oranını Girme Sekmesi */}
      {activeTab === "custom" && (
        <div>
          <label htmlFor="customFaizOrani">Faiz Oranı (%):</label>
          <input
            type="number"
            id="customFaizOrani"
            className="input"
            value={customFaizOrani}
            onChange={(e) => setCustomFaizOrani(e.target.value)}
            placeholder="Faiz oranını girin (ör. 1.75)"
          />
        </div>
      )}

      {/* Ortak Alanlar */}
      <label htmlFor="krediTutari">Kredi Tutarı:</label>
      <input
        type="text"
        id="krediTutari"
        className="input"
        value={krediTutari}
        onChange={(e) => setKrediTutari(formatNumber(e.target.value))}
        placeholder="Kredi tutarını girin"
      />

      <label htmlFor="vade">Vade (Ay):</label>
      <input
        type="number"
        id="vade"
        className="input"
        value={vade}
        onChange={(e) => setVade(e.target.value)}
        placeholder="Vade süresini girin (ay)"
      />

      <button className="button" onClick={krediHesapla}>
        Hesapla
      </button>

      {/* Sonuçlar */}
      {aylikTaksit && (
        <div className="result">
          <h2>Sonuç</h2>
          <p>
            Aylık Taksit: <strong>{aylikTaksit} TL</strong>
          </p>
          <p>
            Toplam Ödeme: <strong>{toplamOdeme} TL</strong>
          </p>
          <p>
            Toplam Faiz: <strong>{toplamFaiz} TL</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default KrediHesaplama;
