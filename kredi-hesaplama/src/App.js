import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from "./components/Header";
import Home from "./pages/Home";
import KrediHesaplama from "./pages/KrediHesaplama";
import MevduatHesaplama from "./pages/MevduatHesaplama";
import Iletisim from "./pages/Iletisim";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/kredi-hesaplama" element={<KrediHesaplama />} />
        <Route path="/mevduat-hesaplama" element={<MevduatHesaplama />} />
        <Route path="/iletisim" element={<Iletisim />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
