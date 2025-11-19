
import React, { useRef } from 'react';
import { Schedule, HolidayType } from '../types';

type AppData = {
  users: string[];
  schedule: Schedule;
  holidays: { [date: string]: HolidayType };
};

interface DataManagementProps {
  onSave: () => AppData;
  onLoad: (data: AppData) => void;
  onSaveProgress: () => void;
  hasUnsavedChanges: boolean;
}

const DataManagement: React.FC<DataManagementProps> = ({ onSave, onLoad, onSaveProgress, hasUnsavedChanges }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveToFile = () => {
    try {
      const dataToSave = onSave();
      const jsonString = JSON.stringify(dataToSave, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'calendario-2026-datos.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      alert("No se pudieron guardar los datos. Revisa la consola para más detalles.");
    }
  };
  
  const handleLoadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          throw new Error("El archivo no es un texto válido.");
        }
        const data = JSON.parse(text);

        if (data && typeof data === 'object' && 'users' in data && 'schedule' in data && 'holidays' in data) {
          onLoad(data as AppData);
        } else {
          alert('El archivo no tiene el formato correcto.');
        }

      } catch (error) {
        console.error("Error al cargar el archivo:", error);
        alert('Hubo un error al procesar el archivo. Asegúrate de que es el archivo correcto y no está dañado.');
      }
    };
    
    reader.onerror = () => {
        alert('No se pudo leer el archivo.');
    };

    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Gestión de Datos</h3>

      <div className={`text-sm p-2 rounded-md text-center mb-4 font-medium transition-colors ${hasUnsavedChanges ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
        {hasUnsavedChanges ? 'Tienes cambios sin guardar' : 'Progreso guardado localmente'}
      </div>

      <div className="flex flex-col space-y-3">
        <button
          onClick={onSaveProgress}
          disabled={!hasUnsavedChanges}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Guardar Progreso
        </button>
        
        <p className="text-xs text-gray-500 text-center pt-2 border-t mt-2">
          Para copias de seguridad o mover datos a otro navegador:
        </p>

        <button
          onClick={handleSaveToFile}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
        >
          Guardar en Archivo (.json)
        </button>
        <button
          onClick={handleLoadClick}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Cargar desde Archivo (.json)
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json"
          className="hidden"
        />
      </div>
    </div>
  );
};

export default DataManagement;
