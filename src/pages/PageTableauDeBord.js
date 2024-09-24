import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { DocumentTextIcon, ChartBarIcon, CurrencyDollarIcon, UserGroupIcon, BellIcon } from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StatCard = ({ title, value, icon: Icon, color, darkMode }) => (
  <div className={`${darkMode ? 'bg-gray-800' : `bg-${color}-100`} ${darkMode ? 'text-white' : `text-${color}-800`} p-6 rounded-lg shadow-lg`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm uppercase font-semibold">{title}</p>
        <p className="text-3xl font-bold mt-2">{value}</p>
      </div>
      <div className={darkMode ? 'text-gray-300' : `text-${color}-600`}>
        <Icon className="h-8 w-8" />
      </div>
    </div>
  </div>
);

const NotificationCenter = ({ notifications, darkMode }) => (
  <div className={`mt-8 p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg`}>
    <h3 className="text-xl font-semibold mb-4 flex items-center">
      <BellIcon className="h-6 w-6 mr-2" />
      Notifications récentes
    </h3>
    <ul className="space-y-2">
      {notifications.map((notif, index) => (
        <li key={index} className={`p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          {notif}
        </li>
      ))}
    </ul>
  </div>
);

const PageTableauDeBord = () => {
  const { darkMode } = useAppContext();
  const [notifications, setNotifications] = useState([]);

  const stats = [
    { title: "Devis en cours", value: "12", icon: DocumentTextIcon, color: "blue" },
    { title: "Chiffre d'affaires", value: "45 000 €", icon: ChartBarIcon, color: "green" },
    { title: "Taux de conversion", value: "68%", icon: CurrencyDollarIcon, color: "yellow" },
    { title: "Nouveaux clients", value: "24", icon: UserGroupIcon, color: "pink" },
  ];

  const chartData = [
    { name: 'Jan', chiffreAffaires: 4000, devis: 24 },
    { name: 'Fév', chiffreAffaires: 3000, devis: 18 },
    { name: 'Mar', chiffreAffaires: 5000, devis: 29 },
    { name: 'Avr', chiffreAffaires: 4500, devis: 26 },
    { name: 'Mai', chiffreAffaires: 6000, devis: 35 },
    { name: 'Juin', chiffreAffaires: 5500, devis: 31 },
  ];

  useEffect(() => {
    // Simuler des notifications en temps réel
    const interval = setInterval(() => {
      const newNotif = `Nouvelle notification ${Math.floor(Math.random() * 100)}`;
      setNotifications(prev => [newNotif, ...prev.slice(0, 4)]);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <h2 className="text-2xl font-bold mb-6 text-teal-700 dark:text-teal-300">Tableau de bord</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} darkMode={darkMode} />
        ))}
      </div>
      <div className={`p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg mb-8`}>
        <h3 className="text-xl font-semibold mb-4">Évolution du chiffre d'affaires et des devis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="chiffreAffaires" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line yAxisId="right" type="monotone" dataKey="devis" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <NotificationCenter notifications={notifications} darkMode={darkMode} />
    </div>
  );
};

export default PageTableauDeBord;