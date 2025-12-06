import React, { useState } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Activity, Search, Menu, X, Globe, Lock } from 'lucide-react';
import Dashboard from './components/Dashboard';
import InfoSection from './components/InfoSection';
import CVSSCalculator from './components/CVSSCalculator';
import { Tooltip } from './components/Tooltip';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'learn' | 'tools'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'learn', label: 'Knowledge Base', icon: <BookOpen size={20} /> },
    { id: 'tools', label: 'CVSS Simulator', icon: <Activity size={20} /> },
  ];

  return (
    <Router>
      <div className="min-h-screen bg-cyber-900 text-slate-100 font-sans selection:bg-cyber-500 selection:text-white">
        
        {/* Navigation Bar */}
        <nav className="fixed top-0 w-full z-50 bg-cyber-900/90 backdrop-blur-md border-b border-cyber-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              
              {/* Left Side: Logo & Navigation */}
              <div className="flex items-center">
                {/* Logo */}
                <Tooltip content="Reset view to Dashboard" position="bottom">
                  <div 
                    className="flex-shrink-0 flex items-center space-x-2 cursor-pointer"
                    onClick={() => setActiveTab('dashboard')}
                  >
                    <div className="bg-gradient-to-br from-cyber-500 to-blue-600 p-2 rounded-lg">
                      <Lock className="text-white h-5 w-5" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold font-mono tracking-tighter text-white">CVE<span className="text-cyber-400">.INSIGHT</span></h1>
                    </div>
                  </div>
                </Tooltip>

                {/* Desktop Nav */}
                <div className="hidden md:block ml-10">
                  <div className="flex items-baseline space-x-4">
                    {navItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id as any)}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                          activeTab === item.id
                            ? 'bg-cyber-800 text-cyber-400 shadow-[0_0_15px_rgba(14,165,233,0.3)]'
                            : 'text-gray-300 hover:text-white hover:bg-cyber-800'
                        }`}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side: Search & Mobile Menu Button */}
              <div className="flex items-center space-x-4">
                {/* Desktop Search Bar */}
                <div className="hidden md:block relative">
                  <div className="relative">
                    <Tooltip content="Search CVE IDs or keywords" position="bottom">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-500" />
                      </div>
                    </Tooltip>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="block w-64 pl-10 pr-3 py-1.5 border border-cyber-700 rounded-full leading-5 bg-cyber-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-cyber-900 focus:border-cyber-500 focus:ring-1 focus:ring-cyber-500 sm:text-sm transition-colors"
                      placeholder="Search CVEs, Topics..."
                    />
                  </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="bg-cyber-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-cyber-700 focus:outline-none"
                  >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-cyber-900 border-b border-cyber-800 animate-slide-down">
              {/* Mobile Search Input */}
              <div className="px-4 pt-4 pb-2">
                 <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-cyber-700 rounded-md leading-5 bg-cyber-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-cyber-500 focus:ring-1 focus:ring-cyber-500 sm:text-sm"
                      placeholder="Search..."
                    />
                  </div>
              </div>

              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as any);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center space-x-3 ${
                      activeTab === item.id
                        ? 'bg-cyber-800 text-cyber-400'
                        : 'text-gray-300 hover:text-white hover:bg-cyber-700'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* Main Content */}
        <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          
          {/* Header Section */}
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {activeTab === 'dashboard' && 'Security Overview'}
              {activeTab === 'learn' && 'Common Vulnerabilities & Exposures'}
              {activeTab === 'tools' && 'Vulnerability Scoring System'}
            </h2>
            <p className="text-gray-400 max-w-3xl">
              {activeTab === 'dashboard' && 'ภาพรวมสถิติช่องโหว่และความปลอดภัยทางไซเบอร์ล่าสุดจากฐานข้อมูลระดับโลก'}
              {activeTab === 'learn' && 'เรียนรู้เกี่ยวกับมาตรฐาน CVE, NVD และกระบวนการจัดการช่องโหว่ความปลอดภัยที่ได้รับการยอมรับในระดับสากล'}
              {activeTab === 'tools' && 'เครื่องมือจำลองการให้คะแนนความรุนแรงของช่องโหว่ (CVSS Calculator Simulation)'}
            </p>
          </div>

          {/* Dynamic Content */}
          <div className="animate-fade-in-up">
            {activeTab === 'dashboard' && <Dashboard searchQuery={searchQuery} />}
            {activeTab === 'learn' && <InfoSection searchQuery={searchQuery} />}
            {activeTab === 'tools' && <CVSSCalculator />}
          </div>

        </main>

        {/* Footer */}
        <footer className="border-t border-cyber-800 bg-cyber-900 py-8 mt-12">
           <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
              <div className="mb-4 md:mb-0">
                <span className="font-mono text-cyber-500">CVE.INSIGHT</span> © 2024
              </div>
              <div className="flex items-center space-x-6">
                <a href="#" className="hover:text-cyber-400 transition-colors">About MITRE</a>
                <a href="#" className="hover:text-cyber-400 transition-colors">NVD Database</a>
                <a href="#" className="hover:text-cyber-400 transition-colors">Privacy</a>
              </div>
           </div>
        </footer>

      </div>
    </Router>
  );
};

export default App;