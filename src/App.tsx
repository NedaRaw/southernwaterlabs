import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import PageLoading from '@/components/PageLoading';

// Code-split route components using React.lazy
const Home = lazy(() => import('@/pages/Home'));
const Laboratories = lazy(() => import('@/pages/Laboratories'));
const CenterDetail = lazy(() => import('@/pages/CenterDetail'));
const BranchDetail = lazy(() => import('@/pages/BranchDetail'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const Services = lazy(() => import('@/pages/Services'));
const News = lazy(() => import('@/pages/News'));
const Register = lazy(() => import('@/pages/Register'));
const Success = lazy(() => import('@/pages/Success'));
const VisitorDetail = lazy(() => import('@/pages/VisitorDetail'));
const Survey = lazy(() => import('@/pages/Survey'));
const Enquiry = lazy(() => import('@/pages/Enquiry'));
const Admin = lazy(() => import('@/pages/Admin'));

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main id="main-content" role="main" tabIndex={-1} className="flex-1 focus:outline-none">
          <Suspense fallback={<PageLoading />}>
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
          </Suspense>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;

