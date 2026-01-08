
import React, { useState, useEffect, useMemo } from 'react';
import { Student } from './types';
import StudentTable from './components/StudentTable';
import StudentForm from './components/StudentForm';
import StatsDashboard from './components/StatsDashboard';
import GeminiInsights from './components/GeminiInsights';
import { generateMockStudents } from './services/geminiService';

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('students');
    return saved ? JSON.parse(saved) : [];
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  const filteredStudents = useMemo(() => {
    return students.filter(s => 
      `${s.firstName} ${s.lastName} ${s.idNumber}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  const handleAddStudent = (student: Student) => {
    if (editingStudent) {
      setStudents(prev => prev.map(s => s.id === student.id ? student : s));
    } else {
      setStudents(prev => [...prev, student]);
    }
    setIsFormOpen(false);
    setEditingStudent(null);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este alumno?')) {
      setStudents(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleGenerateMock = async () => {
    setIsGenerating(true);
    const mockData = await generateMockStudents();
    setStudents(prev => [...prev, ...mockData]);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">EduManager Pro</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-tight">Sistema de Gestión Escolar</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Buscar alumno..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm w-full md:w-64 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <button 
              onClick={() => setIsFormOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all flex items-center gap-2 shadow-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              Nuevo
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <StatsDashboard students={students} />
        
        <GeminiInsights students={students} />

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-slate-800">Listado de Alumnos</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleGenerateMock}
              disabled={isGenerating}
              className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
            >
              {isGenerating ? 'Generando...' : 'Generar Datos Demo (IA)'}
            </button>
            <span className="text-sm text-slate-500">{filteredStudents.length} resultados encontrados</span>
          </div>
        </div>

        <StudentTable 
          students={filteredStudents} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} EduManager Pro. Gestión Académica Inteligente.
        </div>
      </footer>

      {/* Modal Form */}
      {isFormOpen && (
        <StudentForm 
          initialData={editingStudent}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingStudent(null);
          }}
          onSubmit={handleAddStudent}
        />
      )}
    </div>
  );
};

export default App;
