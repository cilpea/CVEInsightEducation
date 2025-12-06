import React, { useState, useEffect } from 'react';
import { ShieldAlert, Info, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';
import { CVSSFactors, SeverityLevel } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Tooltip } from './Tooltip';

const CVSSCalculator: React.FC = () => {
  const [factors, setFactors] = useState<CVSSFactors>({
    attackVector: 0.85, // Network
    complexity: 0.77, // Low
    privileges: 0.85, // None
    userInteraction: 0.85, // None
    confidentiality: 0, // None
    integrity: 0, // None
    availability: 0, // None
  });

  const [score, setScore] = useState<number>(0);
  const [severity, setSeverity] = useState<SeverityLevel>('None');

  // Simplified Mock Calculation Logic based on CVSS 3.1 concepts
  // Note: This is a simulation for educational purposes, not a full implementation of the official formula.
  useEffect(() => {
    // Impact Sub Score
    const impactBase = 1 - ((1 - factors.confidentiality) * (1 - factors.integrity) * (1 - factors.availability));
    const impact = factors.confidentiality === 0 && factors.integrity === 0 && factors.availability === 0 
      ? 0 
      : 6.42 * impactBase;

    // Exploitability Sub Score
    const exploitability = 8.22 * factors.attackVector * factors.complexity * factors.privileges * factors.userInteraction;

    let rawScore = 0;
    if (impact <= 0) {
      rawScore = 0;
    } else {
      rawScore = Math.min(10, impact + exploitability);
    }
    
    // Round up to 1 decimal
    const finalScore = Math.ceil(rawScore * 10) / 10;
    
    setScore(finalScore);

    if (finalScore === 0) setSeverity('None');
    else if (finalScore < 4.0) setSeverity('Low');
    else if (finalScore < 7.0) setSeverity('Medium');
    else if (finalScore < 9.0) setSeverity('High');
    else setSeverity('Critical');

  }, [factors]);

  const getSeverityColor = (sev: SeverityLevel) => {
    switch (sev) {
      case 'Critical': return '#ef4444'; // Red
      case 'High': return '#f97316'; // Orange
      case 'Medium': return '#eab308'; // Yellow
      case 'Low': return '#22c55e'; // Green
      default: return '#94a3b8'; // Gray
    }
  };

  const chartData = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 10 - score },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 bg-cyber-800/50 rounded-xl border border-cyber-700 shadow-xl backdrop-blur-sm">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center space-x-3 mb-4">
          <ShieldAlert className="text-cyber-500 w-8 h-8" />
          <h2 className="text-2xl font-bold font-sans text-white">CVSS Simulator</h2>
        </div>
        <p className="text-gray-400 mb-6 font-sans">
          ทดลองปรับค่าพารามิเตอร์เพื่อดูว่าปัจจัยต่างๆ ส่งผลต่อระดับความรุนแรงของช่องโหว่อย่างไร
          (เป็นการจำลองการคำนวณเบื้องต้น)
        </p>

        {/* Exploitability Metrics */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 border-b border-cyber-700 pb-2">
            <h3 className="text-cyber-400 font-semibold">Exploitability Metrics</h3>
            <span className="text-xs text-gray-500">(ความยากง่ายในการโจมตี)</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center mb-1">
                <label className="block text-sm text-gray-300 mr-2">Attack Vector</label>
                <Tooltip content="โจมตีผ่านเครือข่าย หรือต้องเข้าถึงเครื่องโดยตรง">
                  <HelpCircle size={14} className="text-gray-500 hover:text-cyber-400 cursor-help" />
                </Tooltip>
              </div>
              <select 
                className="w-full bg-cyber-900 border border-cyber-700 rounded p-2 text-white"
                onChange={(e) => setFactors({...factors, attackVector: parseFloat(e.target.value)})}
              >
                <option value={0.85}>Network (ผ่านเครือข่าย)</option>
                <option value={0.62}>Adjacent (เครือข่ายใกล้เคียง)</option>
                <option value={0.55}>Local (ต้องเข้าถึงเครื่อง)</option>
                <option value={0.2}>Physical (ต้องเข้าถึงตัวอุปกรณ์)</option>
              </select>
            </div>
            
            <div>
              <div className="flex items-center mb-1">
                <label className="block text-sm text-gray-300 mr-2">Complexity</label>
                <Tooltip content="ความซับซ้อนของเงื่อนไขที่ต้องมีก่อนโจมตี">
                   <HelpCircle size={14} className="text-gray-500 hover:text-cyber-400 cursor-help" />
                </Tooltip>
              </div>
              <select 
                 className="w-full bg-cyber-900 border border-cyber-700 rounded p-2 text-white"
                 onChange={(e) => setFactors({...factors, complexity: parseFloat(e.target.value)})}
              >
                <option value={0.77}>Low (ซับซ้อนน้อย)</option>
                <option value={0.44}>High (ซับซ้อนมาก)</option>
              </select>
            </div>

            <div>
              <div className="flex items-center mb-1">
                <label className="block text-sm text-gray-300 mr-2">Privileges Required</label>
                <Tooltip content="ระดับสิทธิ์ที่ผู้โจมตีต้องมีในระบบ">
                   <HelpCircle size={14} className="text-gray-500 hover:text-cyber-400 cursor-help" />
                </Tooltip>
              </div>
              <select 
                 className="w-full bg-cyber-900 border border-cyber-700 rounded p-2 text-white"
                 onChange={(e) => setFactors({...factors, privileges: parseFloat(e.target.value)})}
              >
                <option value={0.85}>None (ไม่ต้องมีสิทธิ์)</option>
                <option value={0.62}>Low (ผู้ใช้ทั่วไป)</option>
                <option value={0.27}>High (ผู้ดูแลระบบ)</option>
              </select>
            </div>

            <div>
              <div className="flex items-center mb-1">
                <label className="block text-sm text-gray-300 mr-2">User Interaction</label>
                <Tooltip content="ต้องอาศัยเหยื่อในการกระทำหรือไม่ (เช่น คลิกลิงก์)">
                   <HelpCircle size={14} className="text-gray-500 hover:text-cyber-400 cursor-help" />
                </Tooltip>
              </div>
              <select 
                 className="w-full bg-cyber-900 border border-cyber-700 rounded p-2 text-white"
                 onChange={(e) => setFactors({...factors, userInteraction: parseFloat(e.target.value)})}
              >
                <option value={0.85}>None (ไม่ต้องทำอะไร)</option>
                <option value={0.62}>Required (ต้องมีส่วนร่วม)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Impact Metrics */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center space-x-2 border-b border-cyber-700 pb-2">
            <h3 className="text-cyber-400 font-semibold">Impact Metrics</h3>
            <span className="text-xs text-gray-500">(ผลกระทบต่อระบบ)</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Confidentiality', sub: 'ความลับ', key: 'confidentiality', tip: 'ข้อมูลรั่วไหลสู่ผู้ไม่มีสิทธิ์' },
              { label: 'Integrity', sub: 'ความถูกต้อง', key: 'integrity', tip: 'ข้อมูลถูกแก้ไขหรือเปลี่ยนแปลง' },
              { label: 'Availability', sub: 'ความพร้อมใช้', key: 'availability', tip: 'ระบบล่มหรือใช้งานไม่ได้' },
            ].map((metric) => (
              <div key={metric.key}>
                <div className="flex items-center mb-1">
                  <label className="block text-sm text-gray-300 mr-2">{metric.label}</label>
                  <Tooltip content={metric.tip}>
                    <HelpCircle size={14} className="text-gray-500 hover:text-cyber-400 cursor-help" />
                  </Tooltip>
                </div>
                <select 
                  className="w-full bg-cyber-900 border border-cyber-700 rounded p-2 text-white"
                  onChange={(e) => setFactors({...factors, [metric.key]: parseFloat(e.target.value)})}
                >
                  <option value={0}>None (ไม่มีผล)</option>
                  <option value={0.22}>Low (ต่ำ)</option>
                  <option value={0.56}>High (สูง)</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Score Result */}
      <div className="lg:col-span-1 bg-cyber-900 rounded-xl p-6 flex flex-col items-center justify-center border border-cyber-700 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"></div>
        
        <div className="w-full h-48 relative">
           <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                startAngle={180}
                endAngle={0}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
              >
                <Cell fill={getSeverityColor(severity)} />
                <Cell fill="#334155" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
             <span className="text-5xl font-mono font-bold text-white">{score.toFixed(1)}</span>
             <span className="text-sm text-gray-400">Base Score</span>
          </div>
        </div>

        <Tooltip content={`ความรุนแรงระดับ ${severity} ต้องได้รับการแก้ไขโดยด่วน`} position="bottom">
          <div 
            className="mt-4 px-6 py-2 rounded-full font-bold text-cyber-900 transition-colors duration-300 cursor-default"
            style={{ backgroundColor: getSeverityColor(severity) }}
          >
            {severity.toUpperCase()}
          </div>
        </Tooltip>

        <div className="mt-6 space-y-2 text-sm text-gray-400 w-full">
            <div className="flex justify-between items-center border-b border-cyber-800 pb-2">
                <span>Vector:</span>
                <span className="font-mono text-white">CVSS:3.1/AV:N/AC:L...</span>
            </div>
            <div className="flex justify-between items-center pt-2">
                <span>Status:</span>
                <span className="flex items-center text-green-400"><CheckCircle size={14} className="mr-1"/> Calculated</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CVSSCalculator;