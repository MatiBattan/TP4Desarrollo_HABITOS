import React, { useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import HabitList from './HabitList';
import HabitForm from './HabitForm';

function Dashboard() {
  const { habits, fetchHabits, deleteHabit, setHabits } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHabits();
  }, []);

  return (
    <div>
      <h1>Hábitos</h1>
      <div className="button-container">
        <button onClick={() => navigate('/historial')}>Ver Historial de Hábitos</button>
        <button onClick={() => navigate('/')}>Volver</button>
      </div>
      <HabitForm setHabits={setHabits} />
      <HabitList habits={habits} setHabits={setHabits} deleteHabit={deleteHabit} />
    </div>
  );
}

export default Dashboard;
