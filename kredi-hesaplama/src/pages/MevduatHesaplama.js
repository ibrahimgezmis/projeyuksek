import React, { useEffect, useState } from "react";

const MevduatHesaplama = () => {
  const [mevduatOranlari, setMevduatOranlari] = useState([]);
  const [selectedFaizOrani, setSelectedFaizOrani] = useState(null);
  const [mevduatTutari, setMevduatTutari] = useState("");
  const [vade, setVade] = useState("");
  const [netKazanc, setNetKazanc] = useState(null);
  const [vadeSonuTutar, setVadeSonuTutar] = useState(null);

  useEffect(() => {
    const fetchMevduatOranlari = async () => {
      try {
        const response = await fetch("/api/mevduat-oranlari");
        const data = await response.json();
        console.log("Mevduat Verileri:", data); // Gelen veriyi konsola yazdır
        setMevduatOranlari(data); // Veriyi state'e kaydet
      } catch (error) {
        console.error("Hata:", error);
      }
    };

    fetchMevduatOranlari();
  }, []);

  const mevduatHesapla = () => {
    if (!selectedFaizOrani || !mevduatTutari || !vade) {
      alert("Lütfen tüm alanları doldurun!");
      return;
    }

    const faizOrani = parseFloat(selectedFaizOrani.replace(",", ".")) / 100;
    const mevduat = parseFloat(mevduatTutari.replace(/,/g, ""));
    const aySayisi = parseInt(vade);

    const brutKazanc = mevduat * faizOrani * (aySayisi / 12); // Brüt kazanç
    const netKazanc = brutKazanc * 0.85; // Net kazanç (vergi sonrası)
    const toplamTutar = mevduat + netKazanc; // Vade sonu toplam tutar

    setNetKazanc(netKazanc.toFixed(2));
    setVadeSonuTutar(toplamTutar.toFixed(2));
  };

  const formatNumber = (number) => {
    return number.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="container" style={{ textAlign: "center", padding: "20px" }}>
      <h1>Mevduat Hesaplama</h1>

      <label htmlFor="faizOrani">Faiz Oranı Seçiniz:</label>
      <select
        id="faizOrani"
        className="input"
        onChange={(e) => setSelectedFaizOrani(e.target.value)}
      >
        <option value="">Faiz oranı seçin</option>
        {Array.isArray(mevduatOranlari) &&
          mevduatOranlari.map((item, index) => (
            <option key={index} value={item.faizOrani}>
              {item.urunAdi} - %{item.faizOrani}
            </option>
          ))}
      </select>

      <label htmlFor="mevduatTutari">Mevduat Tutarı:</label>
      <input
        type="text"
        id="mevduatTutari"
        className="input"
        value={mevduatTutari}
        onChange={(e) => setMevduatTutari(formatNumber(e.target.value))}
        placeholder="Mevduat tutarını girin"
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

      <button className="button" onClick={mevduatHesapla}>
        Hesapla
      </button>

      {netKazanc && vadeSonuTutar && (
        <div className="result">
          <h2>Sonuç</h2>
          <p>
            Seçilen Faiz Oranı: <strong>%{selectedFaizOrani}</strong>
          </p>
          <p>
            Net Kazanç: <strong>{netKazanc} TL</strong>
          </p>
          <p>
            Vade Sonu Toplam Tutar: <strong>{vadeSonuTutar} TL</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default MevduatHesaplama;
