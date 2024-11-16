import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function HabitList({ habits, setHabits, deleteHabit }) {
  const [progresses, setProgresses] = useState({});
  const [hoursSpent, setHoursSpent] = useState({});
  const navigate = useNavigate();

  const handleDelete = (id) => {
    deleteHabit(id);
  };

  useEffect(() => {
    const fetchHabitsAndProgresses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8080/api/habitos`, { 
          headers: { Authorization: `Bearer ${token}` }
        });
        setHabits(response.data);

        const progressesData = {};
        for (const habit of response.data) {
          const progressResponse = await axios.get(`http://localhost:8080/api/progresos/${habit.id}`, { 
            headers: { Authorization: `Bearer ${token}` }
          });
          progressesData[habit.id] = progressResponse.data;
        }
        setProgresses(progressesData);

        response.data.forEach(habit => {
          if (habit.mostrarAlerta) {
            alert(`Es momento de cumplir el hábito: ${habit.nombre}`);
          }
        });
      } catch (error) {
        console.error('Error al obtener los hábitos y progresos:', error);
      }
    };

    fetchHabitsAndProgresses();
  }, [setHabits]);

  const handleMarkAsCompleted = async (habitId) => {
    try {
      const progressData = {
        fecha: new Date().toISOString().split('T')[0],
        cumplido: true,
        horas: hoursSpent[habitId] || 0 
      };

      console.log('Enviando datos de progreso:', progressData);
      
      const response = await axios.post(`http://localhost:8080/api/progresos/${habitId}`, progressData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setProgresses((prev) => ({
        ...prev,
        [habitId]: [...(prev[habitId] || []), response.data]
      }));
      
      setHoursSpent((prev) => ({ ...prev, [habitId]: 0 }));
    } catch (error) {
      console.error('Error al registrar el progreso:', error);
    }
  };

  const handleHoursChange = (habitId, hours) => {
    setHoursSpent((prev) => ({
      ...prev,
      [habitId]: hours
    }));
  };

  const handleViewStatistics = (habitId) => {
    navigate(`/Estadisticas/${habitId}`);
  };

  return (
    <ul>
      {Array.isArray(habits) && habits.length > 0 ? (
        habits.map((habit) => (
          <li key={habit.id}>
            <h3>{habit.nombre}</h3>
            <p>{habit.descripcion}</p>
            <p>Frecuencia: {habit.frecuencia}</p>
            <p>Notificaciones: {habit.notificaciones ? 'Sí' : 'No'}</p>

            <div className="progress-container">
              <h4>Progreso:</h4>
              {progresses[habit.id] && progresses[habit.id].length > 0 ? (
                progresses[habit.id].map((progress, index) => (
                  <p key={index}>
                    Fecha: {new Date(progress.fecha).toLocaleDateString()} - Cumplido: {progress.cumplido ? 'Sí' : 'No'} - Horas: {progress.horas || 0}
                  </p>
                ))
              ) : (
                <p>No hay progreso registrado para este hábito.</p>
              )}
            </div>

            <label>
              Horas dedicadas hoy:
              <input
                type="range"
                min="0"
                max="23"
                value={hoursSpent[habit.id] || 0}
                onChange={(e) => handleHoursChange(habit.id, e.target.value)}
              />
              <span className="range-label">{hoursSpent[habit.id] || 0} horas</span>
            </label>

            <button onClick={() => handleMarkAsCompleted(habit.id)}>Marcar como cumplido hoy</button>
            <button onClick={() => handleDelete(habit.id)}>Eliminar</button>
            <button onClick={() => handleViewStatistics(habit.id)}>Ver Estadísticas</button>
          </li>
        ))
      ) : (
        <p>No hay hábitos para mostrar.</p>
      )}
    </ul>
  );
}

export default HabitList;
