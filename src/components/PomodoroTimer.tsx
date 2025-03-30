import { useState, useEffect } from "react";
import Button from "../components/ui/button"; // Ruta corregida
import { Card, CardContent } from "../components/ui/card"; // Ruta corregida

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer: number | undefined;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      alert("¡Tiempo terminado! Toma un descanso.");
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
      <CardContent className="flex flex-col items-center justify-center">
        <p className="text-5xl font-mono text-gray-900 bg-white p-4 rounded-lg shadow-inner">
          {formatTime(timeLeft)}
        </p>
        <div className="flex gap-4">
          <Button 
            onClick={handleStart} 
            disabled={isRunning}
            className="bg-green-500" // Personalización adicional
          >
            Iniciar
          </Button>
          <Button 
            onClick={handlePause} 
            disabled={!isRunning}
            className="bg-yellow-500" // Personalización adicional
          >
            Pausar
          </Button>
          <Button 
            onClick={handleReset}
            className="bg-red-500" // Personalización adicional
          >
            Reiniciar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PomodoroTimer;