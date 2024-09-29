import React, { useState } from 'react';
import Modal from './ui/Modal';
import { CalendarIcon, UserIcon, FlagIcon, CheckCircleIcon, PencilIcon, TrashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../context/AppContext';

const TaskDetailsModal = ({ task, users, priorities, onClose, onEdit, onToggle, onDelete }) => {
  const { darkMode } = useAppContext();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  if (!task) return null;

  const priorityColor = {
    urgent: 'bg-red-100 text-red-800',
    high: 'bg-orange-100 text-orange-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800',
    background: 'bg-blue-100 text-blue-800'
  };

  const getTextColor = (bgColor) => {
    const lightColors = ['bg-yellow-200', 'bg-green-200', 'bg-blue-200', 'bg-pink-200', 'bg-purple-200'];
    return lightColors.includes(bgColor) ? 'text-gray-800' : 'text-white';
  };

  const textColor = getTextColor(task.color);

  const handleDelete = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    onDelete(task.id);
    onClose();
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  return (
    <Modal isOpen={!!task} onClose={onClose}>
      <div className={`p-6 ${task.color} rounded-xl shadow-lg`}>
        <div className="flex justify-between items-start mb-6">
          <h2 className={`text-3xl font-bold ${textColor}`}>{task.text}</h2>
        </div>
        
        <div className="mb-6">
          <p className={`${textColor} opacity-90`}>{task.description || "Aucune description"}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className={`flex items-center ${textColor}`}>
            <CalendarIcon className="h-5 w-5 mr-2" />
            <span>
              {task.dueDate && typeof task.dueDate.toDate === 'function'
                ? new Date(task.dueDate.toDate()).toLocaleDateString()
                : task.dueDate instanceof Date
                  ? task.dueDate.toLocaleDateString()
                  : 'Non définie'}
            </span>
          </div>
          <div className={`flex items-center ${textColor}`}>
            <FlagIcon className="h-5 w-5 mr-2" />
            <span className={`px-2 py-1 rounded-full text-sm font-semibold ${priorityColor[task.priority] || 'bg-gray-100 text-gray-800'}`}>
              {priorities.find(p => p.id === task.priority)?.name || "Non définie"}
            </span>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className={`text-lg font-semibold mb-2 flex items-center ${textColor}`}>
            <UserIcon className="h-5 w-5 mr-2" />
            Assigné à:
          </h3>
          <div className="flex flex-wrap gap-2">
            {task.assignedTo && task.assignedTo.length > 0 ? (
              task.assignedTo.map(userId => {
                const assignedUser = users.find(u => u.id === userId);
                return assignedUser ? (
                  <div key={userId} className={`px-3 py-1 ${darkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-800'} rounded-full text-sm`}>
                    {assignedUser.firstName} {assignedUser.lastName}
                  </div>
                ) : null;
              })
            ) : (
              <span className={textColor}>Aucun utilisateur assigné</span>
            )}
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => onEdit(task)}
            className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition duration-300 transform hover:scale-105"
          >
            <PencilIcon className="h-5 w-5 mr-2" />
            Modifier
          </button>
          <button
            onClick={() => {
              onToggle(task.id, task.completed);
              onClose();
            }}
            className={`flex items-center px-4 py-2 rounded-lg text-white transition duration-300 transform hover:scale-105 ${
              task.completed ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            {task.completed ? 'Non terminée' : 'Terminée'}
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition duration-300 transform hover:scale-105"
          >
            <TrashIcon className="h-5 w-5 mr-2" />
            Supprimer
          </button>
        </div>
      </div>

      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} p-8 rounded-lg shadow-xl max-w-md mx-auto`}>
            <div className="flex items-center mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500 mr-2" />
              <h2 className="text-xl font-bold">Confirmer la suppression</h2>
            </div>
            <p className="mb-6">Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action est irréversible.</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-300"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default TaskDetailsModal;