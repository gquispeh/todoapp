import { useState, useEffect } from 'react';
import TodoExporter from './TodoExporter';
import TodoImporter from './TodoImporter';


interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  project: string;
  createdAt: Date;
}

interface ProjectGroup {
  name: string;
  todos: TodoItem[];
}

const TodoApp = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [newProject, setNewProject] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [projects, setProjects] = useState<string[]>([]);
  const [projectFilter, setProjectFilter] = useState<string>('');
  const [showImportExport, setShowImportExport] = useState(false);

  // Cargar tareas desde localStorage al inicio
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos);
        const todosWithDates = parsedTodos.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt)
        }));
        setTodos(todosWithDates);
        
        const uniqueProjects = Array.from(new Set(todosWithDates.map((todo: TodoItem) => todo.project)))
          .filter(project => project !== '');
        setProjects(uniqueProjects as string[]);
      } catch (e) {
        console.error('Error al cargar tareas:', e);
      }
    }
  }, []);

  // Guardar tareas en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
    
    const uniqueProjects = Array.from(new Set(todos.map(todo => todo.project)))
      .filter(project => project !== '');
    setProjects(uniqueProjects as string[]);
  }, [todos]);

  const addTodo = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (newTodo.trim() !== '') {
      const newId = crypto.randomUUID();
      const newTodoItem: TodoItem = {
        id: newId,
        text: newTodo.trim(),
        completed: false,
        project: newProject.trim(),
        createdAt: new Date()
      };
      setTodos([...todos, newTodoItem]);
      setNewTodo('');
      // Mantener el proyecto para facilitar la entrada de múltiples tareas relacionadas
    }
  };

  const removeTodo = (id: string) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  const toggleComplete = (id: string) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const clearCompleted = () => {
    const activeTodos = todos.filter(todo => !todo.completed);
    setTodos(activeTodos);
  };

  const getFilteredTodos = () => {
    let filtered = [...todos];
    
    if (filter === 'active') {
      filtered = filtered.filter(todo => !todo.completed);
    } else if (filter === 'completed') {
      filtered = filtered.filter(todo => todo.completed);
    }
    
    if (projectFilter) {
      filtered = filtered.filter(todo => todo.project === projectFilter);
    }
    
    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  };

  const groupTodosByProject = (): ProjectGroup[] => {
    const filteredTodos = getFilteredTodos();
    const groups: { [key: string]: TodoItem[] } = {};
    
    filteredTodos.forEach(todo => {
      const projectName = todo.project || 'Sin proyecto';
      if (!groups[projectName]) {
        groups[projectName] = [];
      }
      groups[projectName].push(todo);
    });
    
    return Object.keys(groups).map(name => ({
      name,
      todos: groups[name]
    }));
  };

  // Función para manejar la importación de tareas
  const handleImportTodos = (importedTodos: TodoItem[]) => {
    // Opción 1: Reemplazar todas las tareas existentes
    // setTodos(importedTodos);
    
    // Opción 2: Añadir a las tareas existentes (evitando duplicados por id)
    const existingIds = new Set(todos.map(todo => todo.id));
    const newTodos = importedTodos.filter(todo => !existingIds.has(todo.id));
    
    setTodos([...todos, ...newTodos]);
  };

  const projectGroups = groupTodosByProject();
  const filteredTodos = getFilteredTodos();
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - activeTodosCount;

  return (
    <div style={{
      maxWidth: '700px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{
        fontSize: '28px',
        fontWeight: 'bold',
        marginBottom: '24px',
        color: '#2c3e50',
        textAlign: 'center',
        borderBottom: '2px solid #f0f4f8',
        paddingBottom: '15px'
      }}>Lista de Pendientes</h1>
      
      <form onSubmit={addTodo} style={{
        marginBottom: '24px',
        backgroundColor: '#f8fafc',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="todoText" style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '6px',
            color: '#4b5563'
          }}>
            Tarea
          </label>
          <input
            id="todoText"
            type="text"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid #cbd5e0',
              fontSize: '15px',
              transition: 'border-color 0.2s ease',
              outline: 'none'
            }}
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="¿Qué necesitas hacer?"
            onKeyPress={handleKeyPress}
          />
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="todoProject" style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '6px',
            color: '#4b5563'
          }}>
            Proyecto
          </label>
          <input
            id="todoProject"
            type="text"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid #cbd5e0',
              fontSize: '15px',
              transition: 'border-color 0.2s ease',
              outline: 'none'
            }}
            value={newProject}
            onChange={(e) => setNewProject(e.target.value)}
            placeholder="Nombre del proyecto (opcional)"
            list="project-suggestions"
          />
          <datalist id="project-suggestions">
            {projects.map(project => (
              <option key={project} value={project} />
            ))}
          </datalist>
        </div>
        
        <button 
          type="submit" 
          style={{
            width: '100%',
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '10px',
            borderRadius: '6px',
            border: 'none',
            fontWeight: '500',
            fontSize: '15px',
            cursor: newTodo.trim() === '' ? 'not-allowed' : 'pointer',
            opacity: newTodo.trim() === '' ? 0.7 : 1,
            transition: 'background-color 0.2s ease',
            marginTop: '8px'
          }}
          disabled={newTodo.trim() === ''}
        >
          Agregar Tarea
        </button>
      </form>
      
      {/* Área de importación/exportación */}
      <button 
        onClick={() => setShowImportExport(!showImportExport)} 
        style={{ marginBottom: '10px', padding: '10px', cursor: 'pointer' }}
      >
        {showImportExport ? 'Ocultar Importar/Exportar' : 'Mostrar Importar/Exportar'}
      </button>
      {showImportExport && (
        <div style={{
          marginBottom: '24px',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            padding: '12px 16px',
            backgroundColor: '#f8fafc',
            margin: 0,
            color: '#334155',
            borderBottom: '1px solid #e2e8f0'
          }}>Importar / Exportar</h3>
          
          <div style={{ padding: '16px' }}>
            <TodoImporter onImport={handleImportTodos} />
            <TodoExporter todos={todos} />
          </div>
        </div>
      )}
      
      {todos.length > 0 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '20px',
          padding: '10px',
          backgroundColor: '#f8fafc',
          borderRadius: '6px'
        }}>
          <button 
            onClick={() => setFilter('all')} 
            style={{
              padding: '8px 14px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: filter === 'all' ? '#3b82f6' : '#e2e8f0',
              color: filter === 'all' ? 'white' : '#4b5563',
              fontWeight: filter === 'all' ? '600' : '400',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Todas ({todos.length})
          </button>
          <button 
            onClick={() => setFilter('active')} 
            style={{
              padding: '8px 14px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: filter === 'active' ? '#3b82f6' : '#e2e8f0',
              color: filter === 'active' ? 'white' : '#4b5563',
              fontWeight: filter === 'active' ? '600' : '400',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Activas ({activeTodosCount})
          </button>
          <button 
            onClick={() => setFilter('completed')} 
            style={{
              padding: '8px 14px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: filter === 'completed' ? '#3b82f6' : '#e2e8f0',
              color: filter === 'completed' ? 'white' : '#4b5563',
              fontWeight: filter === 'completed' ? '600' : '400',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Completadas ({completedCount})
          </button>
          
          {todos.some(todo => todo.completed) && (
            <button 
              onClick={clearCompleted} 
              style={{
                padding: '8px 14px',
                borderRadius: '20px',
                border: 'none',
                backgroundColor: '#ef4444',
                color: 'white',
                fontWeight: '500',
                fontSize: '14px',
                cursor: 'pointer',
                marginLeft: 'auto',
                transition: 'background-color 0.2s ease'
              }}
            >
              Limpiar completadas
            </button>
          )}
        </div>
      )}
      
      {projects.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="projectFilter" style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '6px',
            color: '#4b5563'
          }}>
            Filtrar por proyecto:
          </label>
          <select 
            id="projectFilter"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid #cbd5e0',
              fontSize: '15px',
              backgroundColor: 'white',
              cursor: 'pointer'
            }}
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
          >
            <option value="">Todos los proyectos</option>
            {projects.map(project => (
              <option key={project} value={project}>{project}</option>
            ))}
          </select>
        </div>
      )}
      
      {filteredTodos.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px 0',
          color: '#94a3b8',
          fontSize: '16px'
        }}>
          <p>No hay tareas pendientes</p>
        </div>
      ) : (
        <div>
          {projectGroups.map(group => (
            <div key={group.name} style={{
              marginBottom: '24px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                padding: '12px 16px',
                borderBottom: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
                margin: 0,
                color: '#334155'
              }}>{group.name}</h3>
              <ul style={{
                listStyle: 'none',
                margin: 0,
                padding: 0
              }}>
                {group.todos.map((todo) => (
                  <li key={todo.id} style={{
                    borderBottom: '1px solid #f1f5f9',
                    position: 'relative'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px 16px',
                      transition: 'background-color 0.2s ease',
                      backgroundColor: todo.completed ? '#f8fafc' : 'transparent'
                    }}>
                      <input
                        type="checkbox"
                        style={{
                          width: '18px',
                          height: '18px',
                          marginRight: '12px',
                          cursor: 'pointer',
                          accentColor: '#3b82f6'
                        }}
                        checked={todo.completed}
                        onChange={() => toggleComplete(todo.id)}
                        id={`todo-${todo.id}`}
                      />
                      <label
                        htmlFor={`todo-${todo.id}`}
                        style={{
                          flexGrow: 1,
                          cursor: 'pointer',
                          textDecoration: todo.completed ? 'line-through' : 'none',
                          color: todo.completed ? '#94a3b8' : '#334155',
                          fontSize: '15px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          width: 'calc(100% - 30px)'
                        }}
                      >
                        <span>{todo.text}</span>
                        <span style={{
                          fontSize: '12px',
                          color: '#94a3b8',
                          marginLeft: '8px'
                        }}>
                          {new Date(todo.createdAt).toLocaleDateString()}
                        </span>
                      </label>
                      <button 
                        onClick={() => removeTodo(todo.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          fontSize: '20px',
                          cursor: 'pointer',
                          padding: '0 8px',
                          marginLeft: '8px',
                          opacity: '0.7',
                          transition: 'opacity 0.2s ease'
                        }}
                        aria-label="Eliminar tarea"
                        title="Eliminar"
                      >
                        ×
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoApp;