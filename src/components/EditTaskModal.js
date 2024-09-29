import React, { useState, useEffect } from 'react';
import Modal from './ui/Modal';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useAppContext } from '../context/AppContext';

const EditTaskModal = ({ task, priorities, users, onSave, onCancel }) => {
  const { darkMode } = useAppContext();
  const [editedTask, setEditedTask] = useState(task);

  useEffect(() => {
    setEditedTask(task);
  }, [task]);

  if (!editedTask) return null;

  const modalBgColor = darkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const inputBgColor = darkMode ? 'bg-gray-700' : 'bg-white';
  const inputBorderColor = darkMode ? 'border-gray-600' : 'border-gray-300';

  const handleChange = (field, value) => {
    setEditedTask(prev => ({ ...prev, [field]: value }));
  };

  const handleUserAssignment = (userId) => {
    const newAssignedTo = editedTask.assignedTo?.includes(userId)
      ? editedTask.assignedTo.filter(id => id !== userId)
      : [...(editedTask.assignedTo || []), userId];
    handleChange('assignedTo', newAssignedTo);
  };

  const handleSave = () => {
    const cleanedTask = Object.fromEntries(
      Object.entries(editedTask).filter(([_, v]) => v != null)
    );
    console.log("Tâche mise à jour:", cleanedTask);
    onSave(cleanedTask);
  };

  return (
    <Modal isOpen={!!editedTask} onClose={onCancel}>
      <div className={`p-6 ${modalBgColor} rounded-xl`}>
        <h2 className={`text-2xl font-bold mb-4 ${textColor}`}>Modifier la tâche</h2>
        <input
          type="text"
          value={editedTask.text || ''}
          onChange={(e) => handleChange('text', e.target.value)}
          className={`w-full p-2 border rounded-md mb-4 ${inputBgColor} ${inputBorderColor} ${textColor}`}
          placeholder="Titre de la tâche"
        />
        <textarea
          value={editedTask.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          className={`w-full p-2 border rounded-md mb-4 ${inputBgColor} ${inputBorderColor} ${textColor}`}
          rows="3"
          placeholder="Description de la tâche"
        />
        <select
          value={editedTask.priority || ''}
          onChange={(e) => handleChange('priority', e.target.value)}
          className={`w-full p-2 border rounded-md mb-4 ${inputBgColor} ${inputBorderColor} ${textColor}`}
        >
          <option value="">Sélectionner une priorité</option>
          {priorities.map(priority => (
            <option key={priority.id} value={priority.id}>{priority.name}</option>
          ))}
        </select>
        <DatePicker
          selected={editedTask.dueDate instanceof Date ? editedTask.dueDate : null}
          onChange={(date) => handleChange('dueDate', date)}
          className={`w-full p-2 border rounded-md mb-4 ${inputBgColor} ${inputBorderColor} ${textColor}`}
          dateFormat="dd/MM/yyyy"
          placeholderText="Date d'échéance"
        />
        <div className="mb-4">
          <h3 className={`text-lg font-semibold mb-2 ${textColor}`}>Assigner à :</h3>
          <div className="flex flex-wrap gap-2">
            {users.map(user => (
              <button
                key={user.id}
                onClick={() => handleUserAssignment(user.id)}
                className={`px-3 py-1 rounded-full text-sm ${
                  editedTask.assignedTo?.includes(user.id)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {user.firstName} {user.lastName}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleSave}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition duration-300"
          >
            Enregistrer
          </button>
          <button
            onClick={onCancel}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-300"
          >
            Annuler
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditTaskModal;