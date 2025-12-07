import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { CVELog } from '../types';
import { AlertCircle, ExternalLink, Info, X, Shield, CheckCircle, Wrench, FileText } from 'lucide-react';
import { Tooltip } from './Tooltip';

const mockData = [
  { year: '2019', cve: 17305 },
  { year: '2020', cve: 18351 },
  { year: '2021', cve: 20161 },
  { year: '2022', cve: 25081 },
  { year: '2023', cve: 28961 },
];

const mockRecentCVEs: CVELog[] = [
  { 
    id: 'CVE-2024-21412', 
    system: 'Windows', 
    description: 'Internet Shortcut Files Security Feature Bypass', 
    severity: 'High', 
    score: 8.1, 
    date: '2024-02-13',
    details: {
      impact: 'ผู้โจมตีสามารถส่งไฟล์ที่สร้างขึ้นเป็นพิเศษเพื่อหลีกเลี่ยงการแจ้งเตือนความปลอดภัย (Security Checks) เมื่อผู้ใช้เปิดไฟล์นั้น ส่งผลให้ผู้ใช้ไม่ทราบถึงความเสี่ยงที่แท้จริง',
      patches: 'Microsoft ได้ออกแพตช์แก้ไขแล้วในอัปเดตความปลอดภัยเดือนกุมภาพันธ์ 2024 ผู้ใช้ควรอัปเดต Windows เป็นเวอร์ชันล่าสุด',
      workarounds: 'ยังไม่มีวิธีแก้ไขชั่วคราวที่แนะนำ (No Workarounds Identified) ควรติดตั้งแพตช์ทันที',
      references: ['https://msrc.microsoft.com/update-guide/vulnerability/CVE-2024-21412']
    }
  },
  { 
    id: 'CVE-2024-21410', 
    system: 'Exchange', 
    description: 'Exchange Server Privilege Escalation Vulnerability', 
    severity: 'Critical', 
    score: 9.8, 
    date: '2024-02-14',
    details: {
      impact: 'ผู้โจมตีระยะไกล (Remote Attacker) สามารถยกระดับสิทธิ์ (Privilege Escalation) บนเซิร์ฟเวอร์ Exchange เพื่อเข้าควบคุมระบบได้โดยไม่ต้องมีการโต้ตอบจากผู้ใช้',
      patches: 'ติดตั้ง Exchange Server 2019 CU14 หรือ Exchange Server 2016 CU23 ที่มาพร้อมฟีเจอร์ความปลอดภัยล่าสุด',
      workarounds: 'เปิดใช้งาน Extended Protection for Authentication (EPA) บนเซิร์ฟเวอร์ Exchange',
      references: ['https://msrc.microsoft.com/update-guide/vulnerability/CVE-2024-21410']
    }
  },
  { 
    id: 'CVE-2024-21413', 
    system: 'Outlook', 
    description: 'Microsoft Outlook Remote Code Execution Vulnerability', 
    severity: 'Critical', 
    score: 9.8, 
    date: '2024-02-14',
    details: {
      impact: 'ช่องโหว่ #MonikerLink ช่วยให้ผู้โจมตีสามารถข้ามระบบป้องกัน Office Protected View และสั่งรันโค้ดอันตราย (RCE) ได้เพียงแค่เปิดอีเมลใน Preview Pane',
      patches: 'อัปเดต Microsoft Office และ Outlook ให้เป็นเวอร์ชันล่าสุดทันที',
      workarounds: 'ไม่มีวิธีแก้ไขชั่วคราวที่สมบูรณ์ การอัปเดตซอฟต์แวร์เป็นวิธีเดียวที่ป้องกันได้ 100%',
      references: ['https://research.checkpoint.com/2024/the-risks-of-the-monikerlink-bug/']
    }
  },
  { 
    id: 'CVE-2024-0012', 
    system: 'Palo Alto', 
    description: 'PAN-OS: Authentication Bypass in Management Interface', 
    severity: 'High', 
    score: 8.8, 
    date: '2024-11-05',
    details: {
      impact: 'ผู้โจมตีสามารถข้ามขั้นตอนการยืนยันตัวตน (Authentication Bypass) เพื่อเข้าถึงหน้าจัดการ (Management Interface) ของอุปกรณ์ Firewall ได้',
      patches: 'อัปเดต PAN-OS เป็นเวอร์ชันที่แก้ไขแล้วตามคำแนะนำของผู้ผลิต',
      workarounds: 'จำกัดการเข้าถึงหน้า Management Interface ให้เฉพาะ IP Address ที่เชื่อถือได้ (Trusted IP Only) และปิดการเข้าถึงจากอินเทอร์เน็ตสาธารณะ',
      references: ['https://security.paloaltonetworks.com/CVE-2024-0012']
    }
  },
];

interface DashboardProps {
  searchQuery?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ searchQuery = '' }) => {
  const [selectedCve, setSelectedCve] = useState<CVELog | null>(null);

  const filteredCVEs = mockRecentCVEs.filter(cve => 
    cve.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    cve.system.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cve.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 relative">
      
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
                <div 
                  key={cve.id} 
                  className="p-4 bg-cyber-900 rounded-lg border border-cyber-700 hover:border-cyber-500 transition-all cursor-pointer group active:scale-[0.98]"
                  onClick={() => setSelectedCve(cve)}
                >
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

      {/* Vulnerability Detail Modal */}
      {selectedCve && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setSelectedCve(null)}
          ></div>
          <div className="bg-cyber-900 border border-cyber-600 rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col relative z-10 animate-slide-down">
            
            {/* Header */}
            <div className="p-6 border-b border-cyber-700 flex justify-between items-start bg-cyber-800/50 rounded-t-xl">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl font-bold text-white font-mono tracking-tight">{selectedCve.id}</h2>
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                     selectedCve.severity === 'Critical' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
                  }`}>
                    {selectedCve.severity}
                  </span>
                </div>
                <p className="text-gray-300 font-medium">{selectedCve.description}</p>
              </div>
              <button 
                onClick={() => setSelectedCve(null)}
                className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-cyber-700 rounded"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">
              {selectedCve.details ? (
                <>
                  <section>
                    <div className="flex items-center space-x-2 mb-3 text-red-400">
                      <Shield size={20} />
                      <h3 className="text-lg font-bold">Impact</h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed pl-7 border-l-2 border-red-500/20">
                      {selectedCve.details.impact}
                    </p>
                  </section>

                  <section>
                    <div className="flex items-center space-x-2 mb-3 text-green-400">
                      <CheckCircle size={20} />
                      <h3 className="text-lg font-bold">Patches</h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed pl-7 border-l-2 border-green-500/20">
                      {selectedCve.details.patches}
                    </p>
                  </section>

                  <section>
                    <div className="flex items-center space-x-2 mb-3 text-amber-400">
                      <Wrench size={20} />
                      <h3 className="text-lg font-bold">Workarounds</h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed pl-7 border-l-2 border-amber-500/20">
                      {selectedCve.details.workarounds}
                    </p>
                  </section>

                  <section>
                    <div className="flex items-center space-x-2 mb-3 text-blue-400">
                      <FileText size={20} />
                      <h3 className="text-lg font-bold">References</h3>
                    </div>
                    <ul className="pl-7 space-y-2">
                      {selectedCve.details.references.map((ref, idx) => (
                        <li key={idx} className="flex items-start">
                          <ExternalLink size={14} className="mt-1 mr-2 flex-shrink-0 text-cyber-500" />
                          <a 
                            href={ref} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-cyber-400 hover:text-cyber-300 hover:underline break-all text-sm transition-colors"
                          >
                            {ref}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </section>
                </>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <Info size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Detailed analysis for this vulnerability is not available in the demo.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-cyber-700 bg-cyber-800/30 rounded-b-xl flex justify-end">
              <button 
                onClick={() => setSelectedCve(null)}
                className="px-4 py-2 bg-cyber-700 hover:bg-cyber-600 text-white rounded transition-colors text-sm font-medium"
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;