import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [habits, setHabits] = useState([]);
  const [deletedHabits, setDeletedHabits] = useState([]);

  const fetchHabits = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/habitos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setHabits(data);
    } catch (error) {
      console.error("Error al obtener los hábitos:", error);
    }
  };

  const deleteHabit = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:8080/api/habitos/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setHabits((prevHabits) => prevHabits.filter((habit) => habit.id !== id));
    } catch (error) {
      console.error("Error al eliminar el hábito:", error);
    }
  };

  return (
    <AppContext.Provider value={{ habits, setHabits, fetchHabits, deleteHabit, deletedHabits, setDeletedHabits }}>
      {children}
    </AppContext.Provider>
  );
};
