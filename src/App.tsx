import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import Home from '@/pages/Home';
import Laboratories from '@/pages/Laboratories';
import CenterDetail from '@/pages/CenterDetail';
import BranchDetail from '@/pages/BranchDetail';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Services from '@/pages/Services';
import News from '@/pages/News';
import Register from '@/pages/Register';
import Success from '@/pages/Success';
import VisitorDetail from '@/pages/VisitorDetail';
import Survey from '@/pages/Survey';
import Enquiry from '@/pages/Enquiry';
import Admin from '@/pages/Admin';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/laboratories" element={<Laboratories />} />
            <Route path="/laboratories/:centerId" element={<CenterDetail />} />
            <Route path="/laboratories/:centerId/:branchId" element={<BranchDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services" element={<Services />} />
            <Route path="/news" element={<News />} />
            <Route path="/register" element={<Register />} />
            <Route path="/success" element={<Success />} />
            <Route path="/visitor/:id" element={<VisitorDetail />} />
            <Route path="/survey" element={<Survey />} />
            <Route path="/enquiry" element={<Enquiry />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
