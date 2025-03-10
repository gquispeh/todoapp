import React, { useState } from 'react';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  project: string;
  createdAt: Date;
}

interface TodoImporterProps {
  onImport: (importedTodos: TodoItem[]) => void;
}

const TodoImporter: React.FC<TodoImporterProps> = ({ onImport }) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const resetMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    resetMessages();
    
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsImporting(true);
    
    const fileReader = new FileReader();
    
    fileReader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        
        let importedTodos: TodoItem[] = [];
        
        if (fileExtension === 'json') {
          importedTodos = parseJSONFile(content);
        } else if (fileExtension === 'csv') {
          importedTodos = parseCSVFile(content);
        } else if (fileExtension === 'txt') {
          importedTodos = parseTextFile(content);
        } else {
          throw new Error('Formato de archivo no soportado. Por favor, utiliza JSON, CSV o TXT.');
        }
        
        // Validar y arreglar los datos importados
        const validatedTodos = validateAndFixTodos(importedTodos);
        
        onImport(validatedTodos);
        setSuccess(`Se importaron ${validatedTodos.length} tareas correctamente`);
        
        // Limpiar el input file
        event.target.value = '';
      } catch (err: any) {
        setError(err.message || 'Error al importar el archivo');
      } finally {
        setIsImporting(false);
      }
    };
    
    fileReader.onerror = () => {
      setError('Error al leer el archivo');
      setIsImporting(false);
    };
    
    if (file.name.endsWith('.json') || file.name.endsWith('.csv') || file.name.endsWith('.txt')) {
      fileReader.readAsText(file);
    } else {
      setError('Formato de archivo no soportado. Por favor, utiliza JSON, CSV o TXT.');
      setIsImporting(false);
    }
  };
  
  const parseJSONFile = (content: string): TodoItem[] => {
    try {
      const parsed = JSON.parse(content);
      
      // Verificar si es un array
      if (!Array.isArray(parsed)) {
        throw new Error('El archivo JSON debe contener un array de tareas');
      }
      
      return parsed;
    } catch (e) {
      throw new Error('El archivo JSON tiene un formato inválido');
    }
  };
  
  const parseCSVFile = (content: string): TodoItem[] => {
    try {
      // Dividir por líneas
      const lines = content.split('\n');
      
      // Obtener cabeceras
      const headers = lines[0].split(',');
      
      // Mapear índices importantes
      const idIndex = headers.findIndex(h => h.toLowerCase().includes('id'));
      const textIndex = headers.findIndex(h => 
        h.toLowerCase().includes('text') || 
        h.toLowerCase().includes('tarea') || 
        h.toLowerCase().includes('task')
      );
      const completedIndex = headers.findIndex(h => 
        h.toLowerCase().includes('completed') || 
        h.toLowerCase().includes('completada') || 
        h.toLowerCase().includes('done')
      );
      const projectIndex = headers.findIndex(h => 
        h.toLowerCase().includes('project') || 
        h.toLowerCase().includes('proyecto')
      );
      const dateIndex = headers.findIndex(h => 
        h.toLowerCase().includes('date') || 
        h.toLowerCase().includes('fecha') || 
        h.toLowerCase().includes('created')
      );
      
      // Verificar que tenemos al menos el campo de texto
      if (textIndex === -1) {
        throw new Error('El archivo CSV debe tener una columna para el texto de la tarea');
      }
      
      const todos: TodoItem[] = [];
      
      // Procesar cada línea (saltando la cabecera)
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Manejar correctamente campos que pueden tener comas dentro de comillas
        const values: string[] = [];
        let currentValue = '';
        let insideQuotes = false;
        
        for (let j = 0; j < line.length; j++) {
          const char = line[j];
          
          if (char === '"') {
            insideQuotes = !insideQuotes;
          } else if (char === ',' && !insideQuotes) {
            values.push(currentValue);
            currentValue = '';
          } else {
            currentValue += char;
          }
        }
        
        // Añadir el último valor
        values.push(currentValue);
        
        // Crear el objeto todo
        const todo: TodoItem = {
          id: idIndex !== -1 ? values[idIndex].replace(/"/g, '') : crypto.randomUUID(),
          text: textIndex !== -1 ? values[textIndex].replace(/"/g, '') : 'Tarea sin nombre',
          completed: completedIndex !== -1 ? 
            values[completedIndex].toLowerCase().includes('s') || 
            values[completedIndex].toLowerCase().includes('y') || 
            values[completedIndex] === '1' || 
            values[completedIndex].toLowerCase() === 'true' : false,
          project: projectIndex !== -1 ? values[projectIndex].replace(/"/g, '') : '',
          createdAt: dateIndex !== -1 ? new Date(values[dateIndex]) : new Date()
        };
        
        todos.push(todo);
      }
      
      return todos;
    } catch (e) {
      throw new Error('Error al procesar el archivo CSV: ' + e);
    }
  };
  
  const parseTextFile = (content: string): TodoItem[] => {
    try {
      const lines = content.split('\n');
      const todos: TodoItem[] = [];
      
      // Formato esperado: "- [x] Texto de la tarea (Proyecto opcional) - Fecha"
      const taskRegex = /^\s*-\s*\[([ xX])\]\s*(.*?)(?:\s*\((.*?)\))?\s*(?:-\s*(.*?))?$/;
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;
        
        const match = trimmedLine.match(taskRegex);
        
        if (match) {
          const completed = match[1].toLowerCase() === 'x';
          const text = match[2].trim();
          const project = match[3] ? match[3].trim() : '';
          const dateStr = match[4] ? match[4].trim() : '';
          
          const todo: TodoItem = {
            id: crypto.randomUUID(),
            text: text || 'Tarea sin nombre',
            completed,
            project,
            createdAt: dateStr ? new Date(dateStr) : new Date()
          };
          
          todos.push(todo);
        } else {
          // Si no coincide con el formato, tomar la línea entera como texto de la tarea
          todos.push({
            id: crypto.randomUUID(),
            text: trimmedLine,
            completed: false,
            project: '',
            createdAt: new Date()
          });
        }
      }
      
      return todos;
    } catch (e) {
      throw new Error('Error al procesar el archivo de texto');
    }
  };
  
  const validateAndFixTodos = (todos: any[]): TodoItem[] => {
    return todos.map(todo => {
      // Asegurar que todos los campos estén presentes
      const validTodo: TodoItem = {
        id: todo.id || crypto.randomUUID(),
        text: todo.text || 'Tarea sin nombre',
        completed: typeof todo.completed === 'boolean' ? todo.completed : false,
        project: todo.project || '',
        createdAt: todo.createdAt ? new Date(todo.createdAt) : new Date()
      };
      
      // Verificar que la fecha sea válida
      if (isNaN(validTodo.createdAt.getTime())) {
        validTodo.createdAt = new Date();
      }
      
      return validTodo;
    });
  };
  
  return (
    <div style={{
      marginTop: '20px',
      padding: '16px',
      backgroundColor: '#f8fafc',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      marginBottom: '20px'
    }}>
      <h3 style={{
        fontSize: '16px',
        fontWeight: '600',
        marginBottom: '12px',
        color: '#334155'
      }}>Importar Tareas</h3>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <label 
          htmlFor="fileInput"
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '10px 16px',
            borderRadius: '6px',
            border: 'none',
            fontWeight: '500',
            fontSize: '14px',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'background-color 0.2s ease',
            width: 'fit-content'
          }}
        >
          {isImporting ? 'Importando...' : 'Seleccionar archivo'}
        </label>
        
        <input
          id="fileInput"
          type="file"
          accept=".json,.csv,.txt"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          disabled={isImporting}
        />
        
        <div style={{
          fontSize: '14px',
          color: '#64748b',
          marginTop: '4px'
        }}>
          Formatos soportados: CSV, JSON, TXT
        </div>
        
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#b91c1c',
            padding: '10px',
            borderRadius: '4px',
            marginTop: '10px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}
        
        {success && (
          <div style={{
            backgroundColor: '#dcfce7',
            color: '#166534',
            padding: '10px',
            borderRadius: '4px',
            marginTop: '10px',
            fontSize: '14px'
          }}>
            {success}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoImporter;