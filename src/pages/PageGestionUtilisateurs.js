import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { UserCircleIcon, PencilIcon } from '@heroicons/react/24/outline';

const PageGestionUtilisateurs = () => {
  const { isAdmin } = useAuth();
  const { darkMode } = useAppContext();
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (error) {
      console.error("Erreur lors de la mise à jour du rôle:", error);
    }
  };

  const bgClass = darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900';
  const cardClass = darkMode ? 'bg-gray-800' : 'bg-white';
  const buttonClass = "px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors";

  if (!isAdmin) {
    return <div className={`min-h-screen ${bgClass} p-8`}>Accès non autorisé</div>;
  }

  return (
    <div className={`min-h-screen ${bgClass} p-8`}>
      <h1 className="text-3xl font-bold mb-8">Gestion des Utilisateurs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <div key={user.id} className={`${cardClass} rounded-lg shadow-md p-6`}>
            <div className="flex items-center mb-4">
              <UserCircleIcon className="h-10 w-10 text-teal-500 mr-4" />
              <div>
                <h2 className="text-xl font-semibold">{user.firstName} {user.lastName}</h2>
                <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
              </div>
            </div>
            <div className="mb-4">
              <p className="font-medium">Rôle actuel: <span className="text-teal-500">{user.role}</span></p>
            </div>
            {editingUser === user.id ? (
              <div>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  className="w-full p-2 mb-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700"
                >
                  <option value="user">Utilisateur</option>
                  <option value="admin">Administrateur</option>
                </select>
                <button
                  onClick={() => setEditingUser(null)}
                  className={buttonClass}
                >
                  Enregistrer
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditingUser(user.id)}
                className="flex items-center text-teal-500 hover:text-teal-600"
              >
                <PencilIcon className="h-5 w-5 mr-2" />
                Modifier le rôle
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageGestionUtilisateurs;