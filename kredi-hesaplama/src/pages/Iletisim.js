import React, { useState } from "react";

const Iletisim = () => {
  const [form, setForm] = useState({ name: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Mesajınız bize ulaşmıştır.");
    setForm({ name: "", message: "" });
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Bize Ulaşın</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Ad Soyad:
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Mesajınız:
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <button type="submit" style={{ marginTop: "10px" }}>Gönder</button>
      </form>
    </div>
  );
};

export default Iletisim;
