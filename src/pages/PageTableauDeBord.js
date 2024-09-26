import React from 'react';
import { useAppContext } from '../context/AppContext';
import { DocumentTextIcon, ChartBarIcon, CurrencyDollarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StatCard = ({ title, value, icon: Icon, color, darkMode }) => (
  <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:scale-105`}>
    <div className={`p-5 ${darkMode ? 'text-white' : `text-${color}-600`}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className={`rounded-full p-3 ${darkMode ? 'bg-gray-700' : `bg-${color}-100`}`}>
          <Icon className="h-8 w-8" />
        </div>
      </div>
    </div>
    <div className={`w-full h-1 ${darkMode ? `bg-${color}-500` : `bg-${color}-300`}`}></div>
  </div>
);

const PageTableauDeBord = () => {
  const { darkMode } = useAppContext();

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

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text">
        Tableau de bord
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} darkMode={darkMode} />
        ))}
      </div>
      <div className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg mb-8`}>
        <h3 className="text-xl font-semibold mb-6 text-teal-600 dark:text-teal-400">Évolution du chiffre d'affaires et des devis</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
            <XAxis dataKey="name" stroke={darkMode ? "#9CA3AF" : "#4B5563"} />
            <YAxis yAxisId="left" stroke={darkMode ? "#9CA3AF" : "#4B5563"} />
            <YAxis yAxisId="right" orientation="right" stroke={darkMode ? "#9CA3AF" : "#4B5563"} />
            <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1F2937' : '#FFFFFF', border: 'none', borderRadius: '8px' }} />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="chiffreAffaires" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
            <Line yAxisId="right" type="monotone" dataKey="devis" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PageTableauDeBord;