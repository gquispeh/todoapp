import React from 'react';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  project: string;
  createdAt: Date;
}

interface TodoExporterProps {
  todos: TodoItem[];
}

const TodoExporter: React.FC<TodoExporterProps> = ({ todos }) => {
  // Exportar como CSV
  const exportToCSV = () => {
    // Crear cabeceras
    const headers = ['ID', 'Tarea', 'Completada', 'Proyecto', 'Fecha de creación'];
    
    // Formatear los datos
    const csvRows = todos.map(todo => [
      todo.id,
      `"${todo.text.replace(/"/g, '""')}"`, // Escapar comillas dobles
      todo.completed ? 'Sí' : 'No',
      `"${todo.project.replace(/"/g, '""')}"`,
      new Date(todo.createdAt).toLocaleString()
    ]);
    
    // Agregar cabeceras al principio
    csvRows.unshift(headers);
    
    // Convertir cada fila a texto y unir con saltos de línea
    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    
    // Crear y descargar el archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `tareas-${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Exportar como JSON
  const exportToJSON = () => {
    const jsonContent = JSON.stringify(todos, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `tareas-${new Date().toISOString().slice(0, 10)}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Exportar como texto plano
  const exportToText = () => {
    const textContent = todos.map(todo => 
      `- [${todo.completed ? 'x' : ' '}] ${todo.text}${todo.project ? ` (${todo.project})` : ''} - ${new Date(todo.createdAt).toLocaleString()}`
    ).join('\n');
    
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `tareas-${new Date().toISOString().slice(0, 10)}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{
      marginTop: '20px',
      padding: '16px',
      backgroundColor: '#f8fafc',
      borderRadius: '8px',
      border: '1px solid #e2e8f0'
    }}>
      <h3 style={{
        fontSize: '16px',
        fontWeight: '600',
        marginBottom: '12px',
        color: '#334155'
      }}>Exportar Tareas</h3>
      
      <div style={{
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={exportToCSV}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            fontWeight: '500',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease'
          }}
          disabled={todos.length === 0}
        >
          Exportar como CSV
        </button>
        
        <button
          onClick={exportToJSON}
          style={{
            backgroundColor: '#10b981',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            fontWeight: '500',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease'
          }}
          disabled={todos.length === 0}
        >
          Exportar como JSON
        </button>
        
        <button
          onClick={exportToText}
          style={{
            backgroundColor: '#6366f1',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            fontWeight: '500',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease'
          }}
          disabled={todos.length === 0}
        >
          Exportar como Texto
        </button>
      </div>
      
      {todos.length === 0 && (
        <p style={{
          color: '#94a3b8',
          fontSize: '14px',
          marginTop: '12px'
        }}>
          No hay tareas para exportar
        </p>
      )}
    </div>
  );
};

export default TodoExporter;