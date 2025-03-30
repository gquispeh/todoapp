import TodoApp from './components/TodoApp';
import PomodoroTimer from './components/PomodoroTimer';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="container min-vh-100 py-4">
      <div className="row g-4">
        {/* Columna principal - Lista de Tareas */}
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h2 className="h4 mb-0">Lista de Pendientes</h2>
            </div>
            <div className="card-body">
              <TodoApp />
            </div>
          </div>
        </div>

        {/* Columna lateral - Temporizador Pomodoro y estadísticas */}
        <div className="col-md-4">
          <div className="card shadow-sm mb-3">
            <div className="card-header bg-danger text-white">
              <h2 className="h4 mb-0">Temporizador Pomodoro</h2>
            </div>
            <div className="card-body">
              <PomodoroTimer />
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-header bg-secondary text-white">
              <h2 className="h4 mb-0">Estadísticas</h2>
            </div>
            <div className="card-body">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
