import React from 'react';

const TimeInputSeparate = ({ hours, minutes, onChange, name, darkMode }) => {
    const handleHoursChange = (e) => {
      const newHours = parseInt(e.target.value) || 0;
      onChange({ target: { name, value: { hours: newHours, minutes: parseInt(minutes) || 0 } } });
    };
  
    const handleMinutesChange = (e) => {
      const newMinutes = parseInt(e.target.value) || 0;
      onChange({ target: { name, value: { hours: parseInt(hours) || 0, minutes: newMinutes } } });
    };
  
    const totalMinutes = (parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0);

    const selectClass = `w-1/2 p-2 border rounded ${
        darkMode
          ? 'bg-gray-700 border-gray-600 text-white'
          : 'bg-white border-gray-300 text-gray-900'
      } focus:border-teal-500 focus:ring focus:ring-teal-200`;
    
      return (
        <div className="flex items-center space-x-2">
          <select
            value={hours}
            onChange={handleHoursChange}
            className={selectClass}
          >
        {[...Array(19).keys()].map(i => (
          <option key={i} value={i}>{i}h</option>
        ))}
      </select>
      <select
        value={minutes}
        onChange={handleMinutesChange}
        className={selectClass}
      >
        {[...Array(60).keys()].map(i => (
          <option key={i} value={i}>{i}min</option>
        ))}
      </select>
      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
        Total: {totalMinutes} min
      </span>
    </div>
  );
};

export default TimeInputSeparate;