import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, getDocs, writeBatch } from 'firebase/firestore';
import { TrashIcon, CheckIcon, UserIcon, PencilIcon, ChevronUpIcon, ChevronDownIcon, PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';

const colors = {
  light: ['bg-yellow-200', 'bg-green-200', 'bg-blue-200', 'bg-pink-200', 'bg-purple-200'],
  dark: ['bg-yellow-800', 'bg-green-800', 'bg-blue-800', 'bg-pink-800', 'bg-purple-800']
};

// Supprimez cette ligne
// const textColors = [ ... ];

const postItTextColors = {
  'bg-yellow-200': 'text-yellow-900',
  'bg-green-200': 'text-green-900',
  'bg-blue-200': 'text-blue-900',
  'bg-pink-200': 'text-pink-900',
  'bg-purple-200': 'text-purple-900',
  'bg-yellow-800': 'text-yellow-100',
  'bg-green-800': 'text-green-100',
  'bg-blue-800': 'text-blue-100',
  'bg-pink-800': 'text-pink-100',
  'bg-purple-800': 'text-purple-100',
};

const PageAccueil = () => {
  const { darkMode } = useAppContext();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedColor, setSelectedColor] = useState(colors[darkMode ? 'dark' : 'light'][0]);
  // Supprimez la ligne suivante car isLoading n'est pas utilisé
  // const [isLoading, setIsLoading] = useState(true);
  const [isDndReady, setIsDndReady] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filteredUser, setFilteredUser] = useState(null);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showCompletedTasks, setShowCompletedTasks] = useState(true);

  useEffect(() => {
    console.log("Effet de chargement des tâches déclenché");
    const fetchUsers = async () => {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("Utilisateurs récupérés:", usersList);
      setUsers(usersList);
    };
    fetchUsers();

    const q = query(collection(db, 'sharedTasks'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Tâches récupérées:', tasksData);
      setTasks(tasksData);
      setIsDndReady(true);
      console.log('isDndReady set to true');
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const newColor = colors[darkMode ? 'dark' : 'light'][0];
    setSelectedColor(newColor);
  }, [darkMode]);

  const addTask = async (e) => {
    e.preventDefault();
    if (newTask.trim() === '') return;
    const tasksSnapshot = await getDocs(collection(db, 'sharedTasks'));
    const newOrder = tasksSnapshot.size;
    await addDoc(collection(db, 'sharedTasks'), {
      text: newTask,
      completed: false,
      createdAt: new Date(),
      createdBy: user.email,
      assignedTo: selectedUsers, // Ceci devrait déjà être une liste d'ID d'utilisateurs
      color: selectedColor,
      order: newOrder
    });
    setNewTask('');
    setSelectedUsers([]);
    setSelectedColor(colors[darkMode ? 'dark' : 'light'][0]);
  };

  const toggleTask = async (id, completed) => {
    console.log('Toggling task:', id, 'Current completed state:', completed);
    await updateDoc(doc(db, 'sharedTasks', id), { completed: !completed });
  };

  const deleteTask = async (id) => {
    await deleteDoc(doc(db, 'sharedTasks', id));
  };

  const moveTask = async (taskId, direction) => {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (
      (direction === 'up' && taskIndex === 0) ||
      (direction === 'down' && taskIndex === tasks.length - 1)
    ) {
      return; // Ne rien faire si la tâche est déjà en haut ou en bas
    }

    const newTasks = [...tasks];
    const [movedTask] = newTasks.splice(taskIndex, 1);
    newTasks.splice(direction === 'up' ? taskIndex - 1 : taskIndex + 1, 0, movedTask);

    setTasks(newTasks);

    // Mise à jour de l'ordre dans Firestore
    const batch = writeBatch(db);
    newTasks.forEach((task, index) => {
      const taskRef = doc(db, 'sharedTasks', task.id);
      batch.update(taskRef, { order: index });
    });
    await batch.commit().catch(error => console.error("Erreur lors de la mise à jour de l'ordre:", error));
  };

  const startEditingTask = (task) => {
    setEditingTask({ ...task });
  };

  const saveEditedTask = async () => {
    if (editingTask) {
      await updateDoc(doc(db, 'sharedTasks', editingTask.id), {
        text: editingTask.text,
        assignedTo: editingTask.assignedTo,
        color: editingTask.color
      });
      setEditingTask(null);
    }
  };

  const cancelEditing = () => {
    setEditingTask(null);
  };

  const getUserName = (email) => {
    const user = users.find(u => u.email === email);
    return user ? `${user.firstName} ${user.lastName}` : email;
  };

  // Modifiez la fonction de filtrage
  const filteredTasks = tasks.filter(task => {
    console.log('Filtering task:', task, 'showCompletedTasks:', showCompletedTasks);
    return (!filteredUser || task.assignedTo.includes(filteredUser)) &&
           (showCompletedTasks || !task.completed);
  });

  console.log('Tâches non filtrées:', tasks);
  console.log('Tâches filtrées:', filteredTasks);
  console.log('État du filtre:', { filteredUser });
  console.log('isDndReady:', isDndReady);

  console.log('Rendu en cours, nombre de tâches filtrées:', filteredTasks.length);

  console.log('Rendu final, tâches:', filteredTasks);

  return (
    <div className={`min-h-screen p-8 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text">
        Bienvenue sur DevisApp
      </h1>
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <button
            onClick={() => setShowAddTaskForm(!showAddTaskForm)}
            className="bg-teal-500 text-white px-4 py-2 rounded-md flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            {showAddTaskForm ? "Fermer" : "Ajouter une tâche"}
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center"
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filtres
          </button>
        </div>

        {showAddTaskForm && (
          <div className={`mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6`}>
            <h2 className="text-2xl font-semibold mb-4">Ajouter une nouvelle tâche</h2>
            <form onSubmit={addTask} className="space-y-4">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Nouvelle tâche..."
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <div className="flex flex-wrap gap-2">
                {users.map(u => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setSelectedUsers(prev => 
                      prev.includes(u.id) ? prev.filter(id => id !== u.id) : [...prev, u.id]
                    )}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedUsers.includes(u.id) 
                        ? 'bg-teal-500 text-white' 
                        : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {u.firstName} {u.lastName}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                {colors[darkMode ? 'dark' : 'light'].map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full ${color} ${selectedColor === color ? 'ring-2 ring-offset-2 ring-teal-500' : ''}`}
                  />
                ))}
              </div>
              <button
                type="submit"
                className="w-full bg-teal-500 text-white p-2 rounded-md hover:bg-teal-600 transition-colors duration-200"
              >
                Ajouter
              </button>
            </form>
          </div>
        )}

        {showFilters && (
          <div className={`mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6`}>
            <h2 className="text-2xl font-semibold mb-4">Filtres</h2>
            <div className="flex flex-col space-y-4">
              <div>
                <label className="block mb-2">Filtrer par utilisateur attribué :</label>
                <select
                  value={filteredUser || ''}
                  onChange={(e) => setFilteredUser(e.target.value || null)}
                  className={`w-full p-2 border rounded-md ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">Tous les utilisateurs</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showCompletedTasks"
                  checked={showCompletedTasks}
                  onChange={(e) => setShowCompletedTasks(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="showCompletedTasks">Afficher les tâches terminées</label>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <p>Chargement des tâches...</p>
        ) : isDndReady ? (
          filteredTasks.length > 0 ? (
            <ul className="space-y-4 min-h-[50px]">
              {filteredTasks.map((task, index) => {
                const textColorClass = postItTextColors[task.color] || 'text-gray-900';
              
                return (
                  <li
                    key={task.id}
                    className={`${task.color} p-4 rounded-lg shadow-md transition-all duration-300 ${task.completed ? 'opacity-50 line-through' : ''}`}
                  >
                    {editingTask && editingTask.id === task.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editingTask.text}
                          onChange={(e) => setEditingTask({...editingTask, text: e.target.value})}
                          className={`w-full p-2 border rounded-md ${
                            darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                        <div className="flex gap-2">
                          {colors[darkMode ? 'dark' : 'light'].map(color => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => setEditingTask({...editingTask, color})}
                              className={`w-8 h-8 rounded-full ${color} ${editingTask.color === color ? 'ring-2 ring-offset-2 ring-teal-500' : ''}`}
                            />
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {users.map(u => (
                            <button
                              key={u.id}
                              type="button"
                              onClick={() => setEditingTask({
                                ...editingTask,
                                assignedTo: editingTask.assignedTo.includes(u.id)
                                  ? editingTask.assignedTo.filter(id => id !== u.id)
                                  : [...editingTask.assignedTo, u.id]
                              })}
                              className={`px-3 py-1 rounded-full text-sm ${
                                editingTask.assignedTo.includes(u.id) 
                                  ? 'bg-teal-500 text-white' 
                                  : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                              }`}
                            >
                              {u.firstName} {u.lastName}
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-end space-x-2">
                          <button onClick={saveEditedTask} className="bg-green-500 text-white px-4 py-2 rounded">Sauvegarder</button>
                          <button onClick={cancelEditing} className="bg-red-500 text-white px-4 py-2 rounded">Annuler</button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className={`text-lg font-semibold ${textColorClass}`}>{task.text}</h3>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => moveTask(task.id, 'up')}
                              className={`p-1 rounded-full ${textColorClass} bg-opacity-20 hover:bg-opacity-30`}
                              disabled={index === 0}
                            >
                              <ChevronUpIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => moveTask(task.id, 'down')}
                              className={`p-1 rounded-full ${textColorClass} bg-opacity-20 hover:bg-opacity-30`}
                              disabled={index === filteredTasks.length - 1}
                            >
                              <ChevronDownIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => toggleTask(task.id, task.completed)}
                              className={`p-1 rounded-full ${
                                task.completed ? 'bg-green-500 text-white' : `${textColorClass} bg-opacity-20`
                              } hover:bg-opacity-30`}
                            >
                              <CheckIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => startEditingTask(task)}
                              className={`p-1 rounded-full ${textColorClass} bg-opacity-20 hover:bg-opacity-30`}
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => deleteTask(task.id)}
                              className={`p-1 rounded-full bg-red-500 text-white hover:bg-red-600`}
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                        <div className={`flex items-center justify-between text-sm ${textColorClass}`}>
                          <div className="flex items-center space-x-1">
                            <UserIcon className="h-4 w-4" />
                            <span>{getUserName(task.createdBy)}</span>
                          </div>
                          <div className="flex -space-x-2">
                            {task.assignedTo.map(userId => {
                              const assignedUser = users.find(u => u.id === userId);
                              return assignedUser ? (
                                <div key={userId} className={`w-8 h-8 rounded-full ${darkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-300 text-gray-700'} flex items-center justify-center text-xs font-bold border-2 ${darkMode ? 'border-gray-800' : 'border-white'}`}>
                                  {assignedUser.firstName[0]}{assignedUser.lastName[0]}
                                </div>
                              ) : null;
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>Aucune tâche à afficher.</p>
          )
        ) : (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
            <p className="mt-4">Chargement des tâches...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageAccueil;