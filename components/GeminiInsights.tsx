
import React, { useState } from 'react';
import { getStudentInsights } from '../services/geminiService';
import { Student } from '../types';

interface GeminiInsightsProps {
  students: Student[];
}

const GeminiInsights: React.FC<GeminiInsightsProps> = ({ students }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetInsight = async () => {
    setLoading(true);
    const result = await getStudentInsights(students);
    setInsight(result);
    setLoading(false);
  };

  return (
    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <svg className="w-24 h-24 text-indigo-900" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L14.4 7.2L20 8.4L16 12.8L17.2 18.4L12 16L6.8 18.4L8 12.8L4 8.4L9.6 7.2L12 2Z" /></svg>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-600 rounded-lg text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-indigo-900 leading-tight">Análisis Inteligente con IA</h3>
            <p className="text-indigo-600/80 text-sm">Obtén conclusiones automáticas sobre el rendimiento de tu clase.</p>
          </div>
        </div>

        {!insight && !loading && (
          <button 
            onClick={handleGetInsight}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            Generar Reporte
          </button>
        )}

        {loading && (
          <div className="flex items-center gap-3 text-indigo-600">
            <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="font-medium">Gemini está analizando los datos...</span>
          </div>
        )}

        {insight && !loading && (
          <div className="bg-white/60 backdrop-blur-md rounded-xl p-5 border border-indigo-200 mt-2">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Resumen del Tutor IA</span>
              <button 
                onClick={() => setInsight(null)}
                className="text-indigo-400 hover:text-indigo-600"
              >
                Cerrar
              </button>
            </div>
            <div className="prose prose-indigo max-w-none text-slate-700 leading-relaxed whitespace-pre-line">
              {insight}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeminiInsights;
