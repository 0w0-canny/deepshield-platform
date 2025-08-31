import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Detection from './pages/Detection';
import Education from './pages/Education';
import Support from './pages/Support';
import Results from './pages/Results';
import ProofReport from './pages/ProofReport';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/detection" element={<Detection />} />
            <Route path="/education" element={<Education />} />
            <Route path="/support" element={<Support />} />
            <Route path="/results" element={<Results />} />
            <Route path="/report/:id" element={<ProofReport />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}
