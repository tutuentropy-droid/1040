import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Explore from "@/pages/Explore";
import Record from "@/pages/Record";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/record" element={<Record />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}
