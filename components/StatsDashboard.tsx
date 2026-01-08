
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Student } from '../types';

interface StatsDashboardProps {
  students: Student[];
}

const COLORS = ['#3b82f6', '#ec4899', '#94a3b8'];

const StatsDashboard: React.FC<StatsDashboardProps> = ({ students }) => {
  if (students.length === 0) return null;

  const avgGrade = students.reduce((acc, s) => acc + s.grade, 0) / students.length;
  const avgAttendance = students.reduce((acc, s) => acc + s.attendanceRate, 0) / students.length;

  const genderData = [
    { name: 'Masculino', value: students.filter(s => s.gender === 'Masculino').length },
    { name: 'Femenino', value: students.filter(s => s.gender === 'Femenino').length },
    { name: 'Otro', value: students.filter(s => s.gender === 'Otro').length },
  ].filter(d => d.value > 0);

  const gradeRanges = [
    { range: '0-2', count: students.filter(s => s.grade < 3).length },
    { range: '3-5', count: students.filter(s => s.grade >= 3 && s.grade < 6).length },
    { range: '6-8', count: students.filter(s => s.grade >= 6 && s.grade < 9).length },
    { range: '9-10', count: students.filter(s => s.grade >= 9).length },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Summary Cards */}
      <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Total Alumnos</p>
          <p className="text-2xl font-bold text-slate-900">{students.length}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Promedio General</p>
          <p className="text-2xl font-bold text-blue-600">{avgGrade.toFixed(2)}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Asistencia Media</p>
          <p className="text-2xl font-bold text-emerald-600">{avgAttendance.toFixed(1)}%</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Mejor Nota</p>
          <p className="text-2xl font-bold text-amber-500">{Math.max(...students.map(s => s.grade)).toFixed(1)}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Distribución de Notas</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={gradeRanges}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="range" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Género</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 mt-2">
           {genderData.map((entry, index) => (
             <div key={entry.name} className="flex items-center gap-1.5">
               <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
               <span className="text-xs text-slate-600 font-medium">{entry.name}</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
