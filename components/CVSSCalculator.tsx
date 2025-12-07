import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle, HelpCircle, Globe, Box, Unlock, MousePointer, Eye, FileWarning, ServerCrash } from 'lucide-react';
import { CVSSFactors, SeverityLevel } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Tooltip } from './Tooltip';

interface MetricOption {
  value: number;
  label: string;
  description: string;
  color: string;
}

// --- Helper Components for UI ---

const RiskBar = ({ value, max, color }: { value: number; max: number; color: string }) => {
  const percentage = Math.min(100, (value / max) * 100);
  return (
    <div className="w-full h-1.5 bg-cyber-900 rounded-full mt-3 overflow-hidden">
      <div 
        className="h-full transition-all duration-500 ease-out rounded-full"
        style={{ width: `${percentage}%`, backgroundColor: color }}
      />
    </div>
  );
};

interface MetricCardProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  tooltip: string;
  value: number;
  onChange: (val: number) => void;
  options: MetricOption[];
  maxVal: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  tooltip, 
  value, 
  onChange, 
  options,
  maxVal
}) => {
  const selectedOption = options.find(opt => opt.value === value) || options[0];
  
  return (
    <div className="bg-cyber-900/50 p-4 rounded-lg border border-cyber-700 hover:border-cyber-600 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          <Icon size={18} className="text-cyber-400" />
          <div className="flex flex-col">
            <span className="font-semibold text-gray-200 text-sm">{title}</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">{subtitle}</span>
          </div>
        </div>
        <Tooltip content={tooltip}>
          <HelpCircle size={14} className="text-gray-600 hover:text-cyber-400 cursor-help" />
        </Tooltip>
      </div>

      <select 
        className="w-full bg-cyber-800 border border-cyber-700 rounded p-2 text-sm text-white focus:ring-1 focus:ring-cyber-500 focus:border-cyber-500 outline-none transition-shadow"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <RiskBar value={value} max={maxVal} color={selectedOption.color} />
      
      <p className="mt-2 text-xs text-gray-400 h-8 leading-tight">
        {selectedOption.description}
      </p>
    </div>
  );
};

// --- Metric Definitions ---

const exploitabilityMetrics = [
  {
    key: 'attackVector',
    title: 'Attack Vector (AV)',
    subtitle: 'ช่องทางการโจมตี',
    icon: Globe,
    tooltip: 'ระยะห่างของผู้โจมตี: Network (ระยะไกล) เพิ่มคะแนนความเสี่ยงมากที่สุด เพราะโจมตีได้จากทุกที่โดยไม่ต้องเข้าถึงอุปกรณ์ทางกายภาพ',
    maxVal: 0.85,
    options: [
      { value: 0.85, label: 'Network (N)', description: 'โจมตีได้จากระยะไกลผ่านอินเทอร์เน็ต (อันตรายที่สุด)', color: '#ef4444' },
      { value: 0.62, label: 'Adjacent (A)', description: 'ต้องอยู่ในวง LAN หรือเครือข่ายเดียวกัน', color: '#f97316' },
      { value: 0.55, label: 'Local (L)', description: 'ต้องเข้าถึงระบบหรือส่งไฟล์ไปที่เครื่องเหยื่อ', color: '#eab308' },
      { value: 0.2, label: 'Physical (P)', description: 'ต้องสัมผัสอุปกรณ์ทางกายภาพโดยตรง', color: '#22c55e' }
    ]
  },
  {
    key: 'complexity',
    title: 'Attack Complexity (AC)',
    subtitle: 'ความซับซ้อน',
    icon: Box,
    tooltip: 'ความยากง่าย: หากโจมตีได้ง่ายโดยไม่มีเงื่อนไขซับซ้อน (Low) คะแนนจะสูงกว่ากรณีที่ต้องรอจังหวะเวลาพิเศษ (High)',
    maxVal: 0.77,
    options: [
      { value: 0.77, label: 'Low (L)', description: 'โจมตีได้ง่าย ไม่ซับซ้อน สามารถทำซ้ำได้', color: '#ef4444' },
      { value: 0.44, label: 'High (H)', description: 'ต้องมีเงื่อนไขพิเศษหรือจังหวะที่เหมาะสม (โจมตียาก)', color: '#22c55e' }
    ]
  },
  {
    key: 'privileges',
    title: 'Privileges Required (PR)',
    subtitle: 'ระดับสิทธิ์ที่ต้องใช้',
    icon: Unlock,
    tooltip: 'สิทธิ์ตั้งต้น: หากผู้โจมตีไม่ต้องใช้สิทธิ์ใดๆ เลย (None) คะแนนจะสูงที่สุด ยิ่งต้องใช้สิทธิ์สูง คะแนนความเสี่ยงยิ่งลดลง',
    maxVal: 0.85,
    options: [
      { value: 0.85, label: 'None (N)', description: 'ใครก็ได้โจมตีได้ โดยไม่ต้องล็อกอิน', color: '#ef4444' },
      { value: 0.62, label: 'Low (L)', description: 'ต้องเป็น User ทั่วไปในระบบ', color: '#f97316' },
      { value: 0.27, label: 'High (H)', description: 'ต้องเป็น Admin หรือสิทธิ์ระดับสูง', color: '#22c55e' }
    ]
  },
  {
    key: 'userInteraction',
    title: 'User Interaction (UI)',
    subtitle: 'การมีส่วนร่วมของเหยื่อ',
    icon: MousePointer,
    tooltip: 'การหลอกล่อเหยื่อ: หากโจมตีได้สำเร็จโดยเหยื่อไม่ต้องทำอะไรเลย (None) คะแนนจะสูงกว่าการที่ต้องหลอกให้เหยื่อคลิก (Required)',
    maxVal: 0.85,
    options: [
      { value: 0.85, label: 'None (N)', description: 'ระบบถูกโจมตีได้เองโดยเหยื่อไม่ต้องทำอะไร', color: '#ef4444' },
      { value: 0.62, label: 'Required (R)', description: 'ต้องหลอกให้เหยื่อคลิก ติดตั้ง หรือกระทำการบางอย่าง', color: '#22c55e' }
    ]
  }
];

const impactMetrics = [
  {
    key: 'confidentiality',
    title: 'Confidentiality (C)',
    subtitle: 'ความลับของข้อมูล',
    icon: Eye,
    tooltip: 'ผลกระทบต่อความลับ: หากข้อมูลสำคัญรั่วไหลทั้งหมด (High) จะส่งผลให้คะแนนความเสี่ยงสูงขึ้นอย่างมาก',
    maxVal: 0.56,
    options: [
      { value: 0.56, label: 'High (H)', description: 'ข้อมูลสำคัญ/ความลับทั้งหมดรั่วไหล', color: '#ef4444' },
      { value: 0.22, label: 'Low (L)', description: 'ข้อมูลรั่วไหลบางส่วน หรือข้อมูลไม่สำคัญมาก', color: '#eab308' },
      { value: 0, label: 'None (N)', description: 'ไม่มีข้อมูลรั่วไหล', color: '#22c55e' }
    ]
  },
  {
    key: 'integrity',
    title: 'Integrity (I)',
    subtitle: 'ความถูกต้องของข้อมูล',
    icon: FileWarning,
    tooltip: 'ผลกระทบต่อข้อมูล: หากข้อมูลถูกเปลี่ยนแปลงแก้ไขจนสูญเสียความถูกต้องทั้งหมด (High) คะแนนจะสูง',
    maxVal: 0.56,
    options: [
      { value: 0.56, label: 'High (H)', description: 'สูญเสียความน่าเชื่อถือโดยสิ้นเชิง/ถูกแก้ไขระบบหลัก', color: '#ef4444' },
      { value: 0.22, label: 'Low (L)', description: 'ข้อมูลถูกแก้ไขเล็กน้อย ไม่มีผลต่อระบบหลัก', color: '#eab308' },
      { value: 0, label: 'None (N)', description: 'ข้อมูลถูกต้องครบถ้วน', color: '#22c55e' }
    ]
  },
  {
    key: 'availability',
    title: 'Availability (A)',
    subtitle: 'ความพร้อมใช้งาน',
    icon: ServerCrash,
    tooltip: 'ผลกระทบต่อระบบ: หากระบบล่มจนใช้งานไม่ได้ (High) จะถือว่ารุนแรงมากและได้คะแนนสูง',
    maxVal: 0.56,
    options: [
      { value: 0.56, label: 'High (H)', description: 'ระบบล่ม ใช้งานไม่ได้โดยสิ้นเชิง', color: '#ef4444' },
      { value: 0.22, label: 'Low (L)', description: 'ระบบช้าลง หรือใช้งานไม่ได้บางฟังก์ชัน', color: '#eab308' },
      { value: 0, label: 'None (N)', description: 'ระบบทำงานได้ปกติ', color: '#22c55e' }
    ]
  }
];

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
      <div className="lg:col-span-2 space-y-8">
        <div className="flex items-center space-x-3 mb-4">
          <ShieldAlert className="text-cyber-500 w-8 h-8" />
          <h2 className="text-2xl font-bold font-sans text-white">CVSS Simulator</h2>
        </div>
        <p className="text-gray-400 mb-6 font-sans border-l-4 border-cyber-500 pl-4">
          ทดลองปรับค่าพารามิเตอร์เพื่อดูว่าปัจจัยต่างๆ ส่งผลต่อระดับความรุนแรงของช่องโหว่อย่างไร
          (จำลองการคำนวณตามหลักการ CVSS 3.1)
        </p>

        {/* Exploitability Metrics Group */}
        <div>
           <div className="flex items-center space-x-2 mb-4">
              <span className="w-1.5 h-6 bg-cyber-400 rounded-sm"></span>
              <h3 className="text-white font-bold text-lg">Exploitability Metrics</h3>
              <span className="text-gray-500 text-sm font-normal ml-2">ปัจจัยด้านการโจมตี (ยิ่งสูง ยิ่งโจมตีง่าย)</span>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exploitabilityMetrics.map((m) => (
              <MetricCard
                key={m.key}
                icon={m.icon}
                title={m.title}
                subtitle={m.subtitle}
                tooltip={m.tooltip}
                value={factors[m.key as keyof CVSSFactors]}
                onChange={(val) => setFactors({ ...factors, [m.key]: val })}
                options={m.options}
                maxVal={m.maxVal}
              />
            ))}
           </div>
        </div>

        {/* Impact Metrics Group */}
        <div>
           <div className="flex items-center space-x-2 mb-4 mt-6">
              <span className="w-1.5 h-6 bg-red-500 rounded-sm"></span>
              <h3 className="text-white font-bold text-lg">Impact Metrics</h3>
              <span className="text-gray-500 text-sm font-normal ml-2">ผลกระทบต่อ CIA (ยิ่งสูง ยิ่งเสียหายมาก)</span>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {impactMetrics.map((m) => (
              <MetricCard
                key={m.key}
                icon={m.icon}
                title={m.title}
                subtitle={m.subtitle}
                tooltip={m.tooltip}
                value={factors[m.key as keyof CVSSFactors]}
                onChange={(val) => setFactors({ ...factors, [m.key]: val })}
                options={m.options}
                maxVal={m.maxVal}
              />
            ))}
           </div>
        </div>
      </div>

      {/* Score Result Sidebar */}
      <div className="lg:col-span-1">
        <div className="sticky top-24">
          <div className="bg-cyber-900 rounded-xl p-6 flex flex-col items-center justify-center border border-cyber-700 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"></div>
            
            <div className="w-full h-56 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <linearGradient id="gradCritical" x1="0%" y1="0%" x2="100%" y2="0%">
                       <stop offset="0%" stopColor="#ef4444" />
                       <stop offset="100%" stopColor="#991b1b" />
                    </linearGradient>
                    <linearGradient id="gradHigh" x1="0%" y1="0%" x2="100%" y2="0%">
                       <stop offset="0%" stopColor="#f97316" />
                       <stop offset="100%" stopColor="#c2410c" />
                    </linearGradient>
                    <linearGradient id="gradMedium" x1="0%" y1="0%" x2="100%" y2="0%">
                       <stop offset="0%" stopColor="#eab308" />
                       <stop offset="100%" stopColor="#854d0e" />
                    </linearGradient>
                    <linearGradient id="gradLow" x1="0%" y1="0%" x2="100%" y2="0%">
                       <stop offset="0%" stopColor="#22c55e" />
                       <stop offset="100%" stopColor="#14532d" />
                    </linearGradient>
                    <linearGradient id="gradNone" x1="0%" y1="0%" x2="100%" y2="0%">
                       <stop offset="0%" stopColor="#94a3b8" />
                       <stop offset="100%" stopColor="#475569" />
                    </linearGradient>
                  </defs>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={100}
                    startAngle={180}
                    endAngle={0}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={6}
                  >
                    <Cell fill={`url(#grad${severity})`} />
                    <Cell fill="#1e293b" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-10">
                <span className="text-6xl font-mono font-bold text-white tracking-tighter drop-shadow-lg">{score.toFixed(1)}</span>
                <span className="text-sm text-gray-400 uppercase tracking-widest mt-1">Base Score</span>
              </div>
            </div>

            <Tooltip content={`ความรุนแรงระดับ ${severity} ต้องได้รับการแก้ไขโดยด่วน`} position="bottom">
              <div 
                className="px-10 py-3 rounded-full font-black text-cyber-900 text-xl tracking-widest transition-all duration-500 cursor-default transform hover:scale-105"
                style={{ 
                  backgroundColor: getSeverityColor(severity),
                  boxShadow: `0 0 25px ${getSeverityColor(severity)}60`
                }}
              >
                {severity.toUpperCase()}
              </div>
            </Tooltip>

            <div className="mt-8 w-full bg-cyber-800 rounded-lg p-4 border border-cyber-700/50">
                <div className="flex justify-between items-center border-b border-cyber-700 pb-3 mb-3">
                    <span className="text-gray-400 text-sm">Vector String</span>
                    <Tooltip content="Copy Vector String">
                       <span className="text-xs font-mono text-cyber-400 bg-cyber-900 px-2 py-1 rounded border border-cyber-700 cursor-pointer hover:text-white">CVSS:3.1/AV:N/AC:L...</span>
                    </Tooltip>
                </div>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Status</span>
                        <span className="flex items-center text-green-400 font-medium">
                          <CheckCircle size={14} className="mr-1.5"/> Calculated
                        </span>
                    </div>
                </div>
            </div>
            
            {severity === 'Critical' && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg w-full">
                <p className="text-red-400 text-xs text-center">
                  ⚠️ ช่องโหว่นี้มีความเสี่ยงสูงมาก ผู้ดูแลระบบควรรีบแก้ไขทันที (Patch Immediately)
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVSSCalculator;