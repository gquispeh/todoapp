import { useMemo } from 'react';

interface TaskStatsProps {
  todos: {
    id: string;
    text: string;
    completed: boolean;
    project: string;
    createdAt: Date;
  }[];
}

const TaskStats = ({ todos }: TaskStatsProps) => {
  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;

    const tasksByProject = todos.reduce((acc, todo) => {
      if (!acc[todo.project]) {
        acc[todo.project] = { total: 0, completed: 0 };
      }
      acc[todo.project].total++;
      if (todo.completed) acc[todo.project].completed++;
      return acc;
    }, {} as Record<string, { total: number; completed: number }>);

    return { total, completed, pending, tasksByProject };
  }, [todos]);

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#2c3e50' }}>Estadísticas de Tareas</h2>
      <p><strong>Total:</strong> {stats.total}</p>
      <p><strong>Completadas:</strong> {stats.completed}</p>
      <p><strong>Pendientes:</strong> {stats.pending}</p>
      <h3 style={{ marginTop: '12px', fontSize: '18px', fontWeight: 'bold' }}>Por Proyecto:</h3>
      <ul>
        {Object.entries(stats.tasksByProject).map(([project, data]) => (
          <li key={project}>
            <strong>{project || 'Sin proyecto'}:</strong> {data.completed} / {data.total} completadas
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskStats;
