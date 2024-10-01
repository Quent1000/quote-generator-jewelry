import { DocumentPlusIcon } from '@heroicons/react/24/solid';

const Sidebar = () => {
  const menuItems = [
    {
      title: 'Créer un devis',
      icon: <DocumentPlusIcon className="w-6 h-6" />,
      link: '/creer-devis'
    },
    {
      title: 'Créer un devis (V2)',
      icon: <DocumentPlusIcon className="w-6 h-6" />,
      link: '/creer-devis-v2'
    },
  ];

  return (
    <div className="flex flex-col h-screen w-64 bg-white dark:bg-gray-800">
      <div className="flex flex-col h-full overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-bold">Sidebar</h1>
        </div>
        <ul className="space-y-2">
          {menuItems.map((menuItem, index) => (
            <li key={index} className="flex items-center space-x-2">
              <menuItem.icon className="w-6 h-6" />
              <a
                href={menuItem.link}
                className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              >
                {menuItem.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;