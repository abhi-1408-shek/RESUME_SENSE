import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Bulk from "./pages/Bulk";
import "./index.css";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <nav className="w-full flex justify-center py-4 gap-6 bg-white/10 dark:bg-gray-900/20 shadow border-b border-white/10">
        <a href="/" className="text-cyan-500 font-bold hover:underline text-lg">Single Resume</a>
        <a href="/bulk" className="text-fuchsia-500 font-bold hover:underline text-lg">Bulk Analytics</a>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bulk" element={<Bulk />} />
      </Routes>
    <Footer />
    </Router>
  );
}

export default App;
