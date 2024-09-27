import { useState } from 'react';

export const useEmails = () => {
  const [emails, setEmails] = useState([]);

  const sendEmail = (email) => {
    // Logique pour envoyer un email
    setEmails(prevEmails => [...prevEmails, email]);
  };

  return { emails, sendEmail };
};