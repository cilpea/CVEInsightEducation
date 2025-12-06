import React from 'react';
import { Database, Shield, Globe, Users, FileText, Server } from 'lucide-react';

interface InfoSectionProps {
  searchQuery?: string;
}

const InfoSection: React.FC<InfoSectionProps> = ({ searchQuery = '' }) => {
  const query = searchQuery.toLowerCase();
  
  // Helper to check if text contains query
  const matches = (text: string) => !query || text.toLowerCase().includes(query);

  const introText = "CVE Common Vulnerabilities and Exposures คืออะไร อภิธานศัพท์ ช่องโหว่ MITRE Corporation";
  const nvdText = "NVD National Vulnerability Database บทบาท CVSS คะแนน วิเคราะห์";
  const workflowText = "Discovery Reporting CVE ID Analysis กระบวนการ รายงาน ช่องโหว่";
  const cnaText = "CVE Numbering Authorities CNA องค์กร ออกเลข Adobe Apple Google IBM Microsoft Oracle Red Hat Cisco Mozilla Linux HP Intel";

  const showIntro = matches(introText);
  const showNVD = matches(nvdText);
  const showWorkflow = matches(workflowText);
  const showCNA = matches(cnaText);
  
  const hasResults = showIntro || showNVD || showWorkflow || showCNA;
  const singleIntroResult = (showIntro && !showNVD) || (!showIntro && showNVD);

  return (
    <div className="space-y-8">
      {/* Intro Cards */}
      {(showIntro || showNVD) && (
        <div className={`grid grid-cols-1 ${!singleIntroResult ? 'md:grid-cols-2' : ''} gap-6`}>
          {showIntro && (
            <div className="bg-cyber-800 p-6 rounded-xl border border-cyber-700 hover:border-cyber-500 transition-colors group">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-cyber-900 group-hover:bg-cyber-700 transition-colors">
                   <Shield className="text-cyber-500 w-6 h-6" />
                </div>
                <h3 className="ml-3 text-xl font-bold text-white">CVE คืออะไร?</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Common Vulnerabilities and Exposures (CVE) เปรียบเสมือน <span className="text-cyber-400 font-semibold">"อภิธานศัพท์"</span> ของช่องโหว่ความปลอดภัย โดยมีเป้าหมายเพื่อสร้างมาตรฐานในการเรียกชื่อช่องโหว่ให้ตรงกันทั่วโลก สนับสนุนโดยกระทรวงความมั่นคงแห่งมาตุภูมิสหรัฐฯ และดูแลโดย MITRE Corporation
              </p>
            </div>
          )}

          {showNVD && (
            <div className="bg-cyber-800 p-6 rounded-xl border border-cyber-700 hover:border-cyber-500 transition-colors group">
               <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-cyber-900 group-hover:bg-cyber-700 transition-colors">
                   <Database className="text-cyber-accent w-6 h-6" />
                </div>
                <h3 className="ml-3 text-xl font-bold text-white">บทบาทของ NVD</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                หลังจาก CVE ถูกสร้างขึ้น National Vulnerability Database (NVD) จะนำข้อมูลไปวิเคราะห์ต่อ โดยเพิ่มข้อมูลเชิงลึกและการให้คะแนนความรุนแรง (CVSS) ถือเป็นฐานข้อมูลช่องโหว่แห่งชาติที่สมบูรณ์ที่สุด
              </p>
            </div>
          )}
        </div>
      )}

      {/* Workflow Diagram */}
      {showWorkflow && (
        <div className="bg-cyber-800/50 p-8 rounded-xl border border-cyber-700">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">กระบวนการรายงานช่องโหว่ (Vulnerability Lifecycle)</h3>
          
          <div className="relative">
            {/* Connector Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-cyber-700 -translate-y-1/2 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {[
                { icon: <Users />, title: "Discovery", desc: "นักวิจัยค้นพบช่องโหว่", color: "bg-blue-600" },
                { icon: <FileText />, title: "Reporting", desc: "แจ้งไปยัง CNA หรือ MITRE", color: "bg-indigo-600" },
                { icon: <Globe />, title: "CVE ID", desc: "MITRE ออกรหัส CVE ID", color: "bg-purple-600" },
                { icon: <Server />, title: "Analysis", desc: "NVD เผยแพร่และให้คะแนน", color: "bg-green-600" }
              ].map((step, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-full ${step.color} flex items-center justify-center text-white shadow-lg mb-4 border-4 border-cyber-900`}>
                    {step.icon}
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>
                  <p className="text-sm text-gray-400">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CNA Section */}
      {showCNA && (
        <div className="bg-gradient-to-r from-cyber-900 to-cyber-800 p-6 rounded-xl border border-cyber-700">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
               <div>
                  <h3 className="text-xl font-bold text-white">CVE Numbering Authorities (CNA)</h3>
                  <p className="text-gray-400 text-sm mt-1">องค์กรที่ได้รับสิทธิ์ในการออกเลข CVE ได้เอง</p>
               </div>
               <span className="bg-cyber-700 text-cyber-400 px-3 py-1 rounded text-xs font-mono mt-4 md:mt-0">90+ Organizations</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 opacity-70">
              {['Adobe', 'Apple', 'Google', 'IBM', 'Microsoft', 'Oracle', 'Red Hat', 'Cisco', 'Mozilla', 'Linux', 'HP', 'Intel'].map(brand => (
                  <div key={brand} className="bg-cyber-900 p-3 rounded text-center border border-cyber-700 hover:border-cyber-500 hover:text-white hover:opacity-100 transition-all cursor-default text-gray-400 font-mono text-sm">
                      {brand}
                  </div>
              ))}
          </div>
        </div>
      )}

      {!hasResults && (
        <div className="text-center py-12">
            <div className="bg-cyber-800/50 inline-block p-6 rounded-xl border border-cyber-700">
                <Globe className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No topics found</h3>
                <p className="text-gray-400">We couldn't find any knowledge base topics matching "{searchQuery}"</p>
            </div>
        </div>
      )}
    </div>
  );
};

export default InfoSection;