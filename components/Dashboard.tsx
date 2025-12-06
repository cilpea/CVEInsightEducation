import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { CVELog } from '../types';
import { AlertCircle, ExternalLink, Info } from 'lucide-react';
import { Tooltip } from './Tooltip';

const mockData = [
  { year: '2019', cve: 17305 },
  { year: '2020', cve: 18351 },
  { year: '2021', cve: 20161 },
  { year: '2022', cve: 25081 },
  { year: '2023', cve: 28961 },
];

const mockRecentCVEs: CVELog[] = [
  { id: 'CVE-2024-21412', system: 'Windows', description: 'Internet Shortcut Files Security Feature Bypass', severity: 'High', score: 8.1, date: '2024-02-13' },
  { id: 'CVE-2024-21410', system: 'Exchange', description: 'Exchange Server Privilege Escalation Vulnerability', severity: 'Critical', score: 9.8, date: '2024-02-14' },
  { id: 'CVE-2024-21413', system: 'Outlook', description: 'Microsoft Outlook Remote Code Execution Vulnerability', severity: 'Critical', score: 9.8, date: '2024-02-14' },
  { id: 'CVE-2024-0012', system: 'Palo Alto', description: 'PAN-OS: Authentication Bypass in Management Interface', severity: 'High', score: 8.8, date: '2024-11-05' },
];

interface DashboardProps {
  searchQuery?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ searchQuery = '' }) => {
  const filteredCVEs = mockRecentCVEs.filter(cve => 
    cve.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    cve.system.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cve.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-cyber-800 p-6 rounded-xl border border-cyber-700 shadow-lg">
          <div className="flex items-center space-x-2">
            <h3 className="text-gray-400 text-sm font-medium">Total Published CVEs</h3>
            <Tooltip content="ข้อมูลสะสมทั้งหมดตั้งแต่เริ่มเก็บสถิติใน NVD">
              <Info size={14} className="text-gray-500 hover:text-cyber-400 cursor-help" />
            </Tooltip>
          </div>
          <div className="mt-2 flex items-baseline">
             <span className="text-3xl font-bold text-white font-mono">226,104+</span>
             <span className="ml-2 text-green-400 text-sm font-medium">Updated Today</span>
          </div>
        </div>
        <div className="bg-cyber-800 p-6 rounded-xl border border-cyber-700 shadow-lg">
          <div className="flex items-center space-x-2">
             <h3 className="text-gray-400 text-sm font-medium">Critical Severity (2023)</h3>
             <Tooltip content="สัดส่วนช่องโหว่ที่มีคะแนน CVSS 9.0-10.0">
              <Info size={14} className="text-gray-500 hover:text-cyber-400 cursor-help" />
            </Tooltip>
          </div>
          <div className="mt-2 flex items-baseline">
             <span className="text-3xl font-bold text-cyber-danger font-mono">14.2%</span>
             <span className="ml-2 text-gray-500 text-sm">of total</span>
          </div>
        </div>
        <div className="bg-cyber-800 p-6 rounded-xl border border-cyber-700 shadow-lg">
          <div className="flex items-center space-x-2">
             <h3 className="text-gray-400 text-sm font-medium">Avg. Analysis Time</h3>
             <Tooltip content="ระยะเวลาเฉลี่ยที่ NVD ใช้ในการวิเคราะห์และให้คะแนน">
              <Info size={14} className="text-gray-500 hover:text-cyber-400 cursor-help" />
            </Tooltip>
          </div>
          <div className="mt-2 flex items-baseline">
             <span className="text-3xl font-bold text-cyber-warning font-mono">5.4</span>
             <span className="ml-2 text-gray-500 text-sm">Days</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <div className="lg:col-span-2 bg-cyber-800 p-6 rounded-xl border border-cyber-700 shadow-lg">
          <div className="flex items-center mb-6">
            <h3 className="text-xl font-bold text-white flex items-center mr-2">
              <span className="w-2 h-6 bg-cyber-500 rounded mr-3"></span>
              CVE Discovery Trend
            </h3>
            <Tooltip content="จำนวนช่องโหว่ที่ถูกค้นพบและลงทะเบียนในแต่ละปี">
               <Info size={16} className="text-gray-500 hover:text-cyber-400 cursor-help" />
            </Tooltip>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="year" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                  itemStyle={{ color: '#38bdf8' }}
                />
                <Legend />
                <Bar dataKey="cve" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Vulnerabilities Found" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent List */}
        <div className="lg:col-span-1 bg-cyber-800 p-6 rounded-xl border border-cyber-700 shadow-lg flex flex-col">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <AlertCircle className="mr-2 text-cyber-warning"/>
            Recent Alerts {searchQuery && '(Filtered)'}
          </h3>
          <div className="flex-1 overflow-auto pr-2 space-y-4 max-h-[300px] scrollbar-thin">
            {filteredCVEs.length > 0 ? (
              filteredCVEs.map((cve) => (
                <div key={cve.id} className="p-4 bg-cyber-900 rounded-lg border border-cyber-700 hover:border-cyber-500 transition-all cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-cyber-400 font-mono text-sm font-bold group-hover:underline">{cve.id}</span>
                    <Tooltip content={`Score: ${cve.score} (${cve.severity})`} position="left">
                      <span className={`text-xs px-2 py-0.5 rounded font-bold cursor-help ${
                        cve.severity === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'
                      }`}>
                        {cve.severity} {cve.score}
                      </span>
                    </Tooltip>
                  </div>
                  <h4 className="text-gray-200 font-semibold text-sm mb-1">{cve.system}</h4>
                  <p className="text-gray-400 text-xs line-clamp-2">{cve.description}</p>
                </div>
              ))
            ) : (
               <div className="text-center text-gray-500 py-8 italic">
                 No CVEs found matching "{searchQuery}"
               </div>
            )}
          </div>
          <Tooltip content="ไปที่เว็บไซต์ฐานข้อมูลความปลอดภัยแห่งชาติ (สหรัฐฯ)">
            <button className="mt-4 w-full py-2 flex items-center justify-center text-sm text-cyber-400 hover:text-white transition-colors border border-dashed border-cyber-700 rounded hover:bg-cyber-700">
              View National Vulnerability Database <ExternalLink size={14} className="ml-2" />
            </button>
          </Tooltip>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;