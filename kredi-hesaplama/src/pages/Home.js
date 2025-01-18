import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Ana Sayfa</h1>
      <p>Sayfamıza hoş geldiniz. Aşağıdaki butonları kullanarak istediğiniz hesaplama modülünü kullanabilirsiniz.</p>
      <p>Bu uygulama Sakarya Üniversitesi Bilişim Teknolojileri Programı Uzaktan Yüksek Lisans Ders Projesi için geliştirilmiştir.
      </p>
      <button onClick={() => navigate("/kredi-hesaplama")} style={styles.button}>Kredi Hesaplama</button>
      <button onClick={() => navigate("/mevduat-hesaplama")} style={styles.button}>Mevduat Hesaplama</button>
      <button onClick={() => navigate("/iletisim")} style={styles.button}>İletişim</button>
    </div>
  );
};

const styles = {
  button: {
    margin: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer"
  }
};

export default Home;
