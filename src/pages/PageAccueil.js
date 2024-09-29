import React, { useState, useEffect, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, getDocs, writeBatch } from 'firebase/firestore';
import { PlusIcon, FunnelIcon, MagnifyingGlassIcon, CalendarIcon } from '@heroicons/react/24/outline';
import AnimatedBackground from '../components/ui/AnimatedBackground';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { v4 as uuidv4 } from 'uuid';  // Ajoutez cette importation en haut du fichier
import TaskDetailsModal from '../components/TaskDetailsModal';
import EditTaskModal from '../components/EditTaskModal';

const colors = {
  light: ['bg-yellow-200', 'bg-green-200', 'bg-blue-200', 'bg-pink-200', 'bg-purple-200'],
  dark: ['bg-yellow-800', 'bg-green-800', 'bg-blue-800', 'bg-pink-800', 'bg-purple-800']
};

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

const priorities = [
  { id: 'urgent', name: 'Urgent' },
  { id: 'high', name: 'Haute priorité' },
  { id: 'medium', name: 'Priorité moyenne' },
  { id: 'low', name: 'Basse priorité' },
  { id: 'background', name: 'Tâche de fond' }
];

const priorityColors = {
  urgent: 'bg-red-500 text-white',
  high: 'bg-orange-500 text-white',
  medium: 'bg-yellow-500 text-black',
  low: 'bg-green-500 text-white',
  background: 'bg-blue-500 text-white'
};

const PageAccueil = () => {
  const { darkMode } = useAppContext();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedColor, setSelectedColor] = useState(colors[darkMode ? 'dark' : 'light'][0]);
  const [isDndReady, setIsDndReady] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filteredUser, setFilteredUser] = useState(null);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showCompletedTasks, setShowCompletedTasks] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [filterPriority, setFilterPriority] = useState(''); // Nouvel état pour le filtre de priorité
  const [showDashboard, setShowDashboard] = useState(true);
  const [dueDate, setDueDate] = useState(null);
  const [taskDescription, setTaskDescription] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);

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
      const tasksData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const draggableId = data.draggableId || doc.id;
        console.log(`Tâche récupérée - ID Firestore: ${doc.id}, DraggableId: ${draggableId}, Données:`, data);
        return {
          id: doc.id,
          draggableId: draggableId,
          ...data,
          assignedTo: data.assignedTo || [],
          dueDate: data.dueDate ? new Date(data.dueDate.seconds * 1000) : null,
          createdAt: data.createdAt ? new Date(data.createdAt.seconds * 1000) : null
        };
      });
      console.log('Toutes les tâches récupérées:', tasksData);
      const sortedTasks = tasksData.sort((a, b) => a.order - b.order);
      setTasks(sortedTasks);
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
    const draggableId = uuidv4();
    await addDoc(collection(db, 'sharedTasks'), {
      text: newTask,
      description: taskDescription,
      completed: false,
      createdAt: new Date(),
      createdBy: user.email,
      assignedTo: selectedUsers,
      color: selectedColor,
      order: newOrder,
      priority: selectedPriority,
      dueDate: dueDate,
      draggableId: draggableId
    });
    setNewTask('');
    setTaskDescription('');
    setSelectedUsers([]);
    setSelectedColor(colors[darkMode ? 'dark' : 'light'][0]);
    setSelectedPriority('');
    setDueDate(null);
  };

  const toggleTask = async (id, completed) => {
    console.log('Toggling task:', id, 'Current completed state:', completed);
    await updateDoc(doc(db, 'sharedTasks', id), { completed: !completed });
  };

  const deleteTask = async (id) => {
    await deleteDoc(doc(db, 'sharedTasks', id));
  };

  const startEditingTask = (task) => {
    setEditingTask({...task});
    closeTaskDetails();
  };

  const saveEditedTask = async (updatedTask) => {
    if (!updatedTask || !updatedTask.id) {
      console.error("Erreur : tâche invalide", updatedTask);
      return;
    }

    const taskRef = doc(db, 'sharedTasks', updatedTask.id);
    try {
      await updateDoc(taskRef, updatedTask);
      console.log("Tâche mise à jour avec succès:", updatedTask);
      
      // Mettre à jour l'état local des tâches
      setTasks(prevTasks => prevTasks.map(task => 
        task.id === updatedTask.id ? { ...task, ...updatedTask } : task
      ));
      
      setEditingTask(null); // Fermer le modal d'édition
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la tâche:", error);
    }
  };

  const calculateTaskStats = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return {
      "Tâches totales": totalTasks,
      "Tâches terminées": completedTasks,
      "Tâches en cours": pendingTasks,
      "Taux d'achèvement": completionRate.toFixed(2)
    };
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = !filterPriority || task.priority === filterPriority; // Utiliser filterPriority au lieu de selectedPriority
    const matchesUser = !filteredUser || task.assignedTo.includes(filteredUser);
    const matchesCompletion = showCompletedTasks || !task.completed;

    return matchesSearch && matchesPriority && matchesUser && matchesCompletion;
  });

  const sortedFilteredTasks = filteredTasks.sort((a, b) => a.order - b.order);

  console.log('Tâches non filtrées:', tasks);
  console.log('Tâches filtrées:', filteredTasks);
  console.log('État du filtre:', { filteredUser });
  console.log('isDndReady:', isDndReady);
  console.log('Rendu en cours, nombre de tâches filtrées:', filteredTasks.length);
  console.log('Rendu final, tâches:', filteredTasks);

  const onDragEnd = useCallback((result) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Recalculer l'ordre pour maintenir la structure de la grille
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));

    // Mise à jour de l'ordre dans Firestore
    const batch = writeBatch(db);
    updatedItems.forEach((task) => {
      const taskRef = doc(db, 'sharedTasks', task.id);
      batch.update(taskRef, { order: task.order });
    });

    batch.commit().then(() => {
      setTasks(updatedItems);
      console.log('Mise à jour de l\'ordre des tâches réussie');
    }).catch((error) => {
      console.error("Erreur lors de la mise à jour de l'ordre des tâches:", error);
    });
  }, [tasks]);

  const openTaskDetails = (task) => {
    setSelectedTask(task);
  };

  const closeTaskDetails = () => {
    setSelectedTask(null);
  };

  // Fonction pour tronquer la description
  const truncateDescription = (description, maxLength = 50) => {
    if (!description) return '';
    if (description.length <= maxLength) return description;
    return description.substr(0, maxLength) + '...';
  };

  return (
    <AnimatedBackground darkMode={darkMode} intensity="low">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text">
          Bienvenue sur DevisApp
        </h1>
        
        <div className="max-w-6xl mx-auto">
          {/* Tableau de bord */}
          {showDashboard && (
            <div className={`mb-8 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-lg shadow-xl p-6`}>
              <h2 className="text-2xl font-semibold mb-4">Tableau de bord</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Object.entries(calculateTaskStats()).map(([key, value]) => (
                  <div key={key} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <h3 className="text-lg font-semibold mb-2">{key}</h3>
                    <p className="text-3xl font-bold">{value}{key === "Taux d'achèvement" && '%'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contrôles pour afficher/masquer les sections */}
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
            <button
              onClick={() => setShowDashboard(!showDashboard)}
              className="bg-purple-500 text-white px-4 py-2 rounded-md flex items-center"
            >
              {showDashboard ? "Masquer le tableau de bord" : "Afficher le tableau de bord"}
            </button>
          </div>

          {/* Formulaire d'ajout de tâche */}
          {showAddTaskForm && (
            <div className={`mb-8 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-lg shadow-xl p-6`}>
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
                <textarea
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Description détaillée de la tâche..."
                  className={`w-full p-2 border rounded-md ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  rows="3"
                />
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className={`w-full p-2 border rounded-md ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">Sélectionner une priorité</option>
                  {priorities.map(priority => (
                    <option key={priority.id} value={priority.id}>{priority.name}</option>
                  ))}
                </select>
                <DatePicker
                  selected={dueDate}
                  onChange={(date) => setDueDate(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Sélectionnez une date d'échéance"
                  className={`w-full p-2 border rounded-md ${
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

          {/* Filtres et recherche */}
          {showFilters && (
            <div className={`mb-8 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-lg shadow-xl p-6`}>
              <h2 className="text-2xl font-semibold mb-4">Filtres et recherche</h2>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center">
                  <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher une tâche..."
                    className={`w-full p-2 border rounded-md ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
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
                <div>
                  <label className="block mb-2">Filtrer par priorité :</label>
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className={`w-full p-2 border rounded-md ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="">Toutes les priorités</option>
                    {priorities.map(priority => (
                      <option key={priority.id} value={priority.id}>{priority.name}</option>
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

          {/* Liste des tâches */}
          {isLoading ? (
            <p>Chargement des tâches...</p>
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="tasks">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  >
                    {sortedFilteredTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => openTaskDetails(task)}
                            className={`${task.color} p-4 rounded-lg shadow-md transition-all duration-300 cursor-pointer ${
                              task.completed ? 'opacity-50' : ''
                            } ${
                              snapshot.isDragging ? 'shadow-lg scale-105' : ''
                            } flex flex-col justify-between`}
                          >
                            <div>
                              <h3 className={`text-lg font-semibold ${postItTextColors[task.color] || 'text-gray-900'} ${task.completed ? 'line-through' : ''}`}>
                                {task.text}
                              </h3>
                              {task.description && (
                                <p className={`text-sm ${postItTextColors[task.color] || 'text-gray-900'} mt-2 line-clamp-2`}>
                                  {truncateDescription(task.description)}
                                </p>
                              )}
                              <p className={`text-sm ${postItTextColors[task.color] || 'text-gray-900'} mt-2`}>
                                {task.dueDate && task.dueDate.toDate && (
                                  <span className="flex items-center mb-1">
                                    <CalendarIcon className="h-4 w-4 mr-1" />
                                    {new Date(task.dueDate.toDate()).toLocaleDateString()}
                                  </span>
                                )}
                              </p>
                            </div>
                            <div className="flex justify-between items-end mt-4">
                              <div className="flex flex-wrap">
                                {task.assignedTo && task.assignedTo.length > 0 && (
                                  task.assignedTo.map(userId => {
                                    const assignedUser = users.find(u => u.id === userId);
                                    return assignedUser ? (
                                      <span key={userId} className={`text-sm ${postItTextColors[task.color] || 'text-gray-900'} mr-2`}>
                                        {assignedUser.firstName} {assignedUser.lastName}
                                      </span>
                                    ) : null;
                                  })
                                )}
                              </div>
                              {task.priority && (
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${priorityColors[task.priority]}`}>
                                  {priorities.find(p => p.id === task.priority)?.name || task.priority}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          users={users}
          priorities={priorities}
          onClose={closeTaskDetails}
          onEdit={startEditingTask}
          onToggle={toggleTask}
          onDelete={deleteTask}
        />
      )}

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          priorities={priorities}
          users={users}  // Ajoutez cette ligne
          onSave={saveEditedTask}
          onCancel={() => setEditingTask(null)}
        />
      )}
    </AnimatedBackground>
  );
};

export default PageAccueil;