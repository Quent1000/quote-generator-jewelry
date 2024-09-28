import { useState } from 'react';

const useFormValidation = (initialState, validationRules) => {
  const [errors, setErrors] = useState({});

  const validate = (data) => {
    const newErrors = {};
    Object.keys(validationRules).forEach(field => {
      const value = field.split('.').reduce((obj, key) => obj?.[key], data);
      const error = validationRules[field](value, data);
      if (error) {
        newErrors[field] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { errors, validate };
};

export default useFormValidation;