const mongoose = require("mongoose");

const MevduatSchema = new mongoose.Schema({
  bankaAdi: String,
  mevduatOrani: Number,
  tarih: { type: Date, default: Date.now },
});

// Eğer model zaten tanımlıysa yeniden tanımlama
module.exports = mongoose.models.Mevduat || mongoose.model("Mevduat", MevduatSchema);
