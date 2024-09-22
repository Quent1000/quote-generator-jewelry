import React, { useState, useEffect } from 'react';

const TimeInput = ({ value, onChange, name }) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (value) {
      const hours = Math.floor(value / 60);
      const minutes = value % 60;
      setInputValue(
        hours > 0
          ? minutes > 0
            ? `${hours}h${minutes}`
            : `${hours}h`
          : `${minutes}min`
      );
    }
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    const regex = /^(\d+)\s*h?\s*(\d*)\s*m?i?n?$/i;
    const match = newValue.match(regex);

    if (match) {
      const hours = parseInt(match[1]) || 0;
      const minutes = parseInt(match[2]) || 0;
      const totalMinutes = hours * 60 + minutes;
      onChange({ target: { name, value: totalMinutes } });
    }
  };

  return (
    <input
      type="text"
      value={inputValue}
      onChange={handleChange}
      placeholder="ex: 1h30, 45min, 2h, 20min"
      className="w-full p-2 border rounded focus:border-teal-500 focus:ring focus:ring-teal-200"
    />
  );
};

export default TimeInput;