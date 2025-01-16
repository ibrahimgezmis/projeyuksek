const mongoose = require("mongoose");

const KrediSchema = new mongoose.Schema({
  bankaAdi: String,
  faizOrani: Number,
  tarih: { type: Date, default: Date.now },
});

// Eğer model zaten tanımlıysa yeniden tanımlama
module.exports = mongoose.models.Kredi || mongoose.model("Kredi", KrediSchema);
