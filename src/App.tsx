import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

// Direct imports eliminate dynamic module loading failures across server restarts & networks
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
import MobileLaboratories from '@/pages/MobileLaboratories';
import VisitorDashboard from '@/pages/VisitorDashboard';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    console.error('App caught an error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900 text-center">
          <div className="max-w-md p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              حدث خطأ أثناء تحميل الصفحة
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              يرجى إعادة تحميل الصفحة للمتابعة
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors"
            >
              إعادة التحميل / Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ErrorBoundary>
        <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B1220] text-[#0F172A] dark:text-[#F8FAFC] transition-colors duration-200">
          <Header />
          <main id="main-content" role="main" tabIndex={-1} className="flex-1 focus:outline-none">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/laboratories" element={<Laboratories />} />
              <Route path="/laboratories/:centerId" element={<CenterDetail />} />
              <Route path="/laboratories/:centerId/:branchId" element={<BranchDetail />} />
              <Route path="/laboratories/:centerId/branches/:branchId" element={<BranchDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:serviceId" element={<Services />} />
              <Route path="/mobile-laboratories" element={<MobileLaboratories />} />
              <Route path="/news" element={<News />} />
              <Route path="/register" element={<Register />} />
              <Route path="/portal" element={<VisitorDashboard />} />
              <Route path="/visitor-dashboard" element={<VisitorDashboard />} />
              <Route path="/success" element={<Success />} />
              <Route path="/visitor/:id" element={<VisitorDetail />} />
              <Route path="/survey" element={<Survey />} />
              <Route path="/enquiry" element={<Enquiry />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<Navigate to="/laboratories" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;

