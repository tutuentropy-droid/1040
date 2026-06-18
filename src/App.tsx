import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Explore from "@/pages/Explore";
import Record from "@/pages/Record";
import Timeline from "@/pages/Timeline";
import RelationGraph from "@/pages/RelationGraph";
import GrowthPath from "@/pages/GrowthPath";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/record" element={<Record />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/relation" element={<RelationGraph />} />
        <Route path="/growth" element={<GrowthPath />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}
