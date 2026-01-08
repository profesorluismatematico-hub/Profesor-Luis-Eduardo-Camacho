
import { GoogleGenAI, Type } from "@google/genai";
import { Student } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getStudentInsights = async (students: Student[]): Promise<string> => {
  if (students.length === 0) return "No hay datos suficientes para generar análisis.";

  const prompt = `Analiza la siguiente lista de alumnos y proporciona un resumen ejecutivo en español. 
  Identifica tendencias en las notas y asistencia. Menciona si hay alumnos en riesgo académico (nota baja y baja asistencia).
  Datos de los alumnos: ${JSON.stringify(students.map(s => ({ 
    nombre: `${s.firstName} ${s.lastName}`, 
    asistencia: s.attendanceRate, 
    nota: s.grade 
  })))}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "Eres un consultor educativo experto en análisis de datos. Tu tono es profesional y constructivo.",
      }
    });
    return response.text || "No se pudo generar el análisis.";
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "Error al conectar con la IA para obtener insights.";
  }
};

export const generateMockStudents = async (): Promise<Student[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Genera una lista de 5 alumnos ficticios con datos realistas para una escuela en Latinoamérica.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              firstName: { type: Type.STRING },
              lastName: { type: Type.STRING },
              idNumber: { type: Type.STRING },
              age: { type: Type.NUMBER },
              gender: { type: Type.STRING },
              email: { type: Type.STRING },
              attendanceRate: { type: Type.NUMBER },
              placeOfBirth: { type: Type.STRING },
              grade: { type: Type.NUMBER }
            },
            required: ["id", "firstName", "lastName", "idNumber", "age", "gender", "email", "attendanceRate", "placeOfBirth", "grade"]
          }
        }
      }
    });
    
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Error generating mock data:", error);
    return [];
  }
};
