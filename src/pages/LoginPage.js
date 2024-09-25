import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { LockClosedIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import logo from '../assets/devisapp-logo.png';

// Constantes pour les messages d'erreur
const ERROR_MESSAGES = {
  LOGIN_FAILED: "Échec de la connexion. Vérifiez vos identifiants.",
  EMPTY_EMAIL: "Veuillez entrer votre adresse e-mail pour réinitialiser le mot de passe.",
  USER_NOT_FOUND: "Aucun compte n'est associé à cette adresse e-mail.",
  INVALID_EMAIL: "L'adresse e-mail n'est pas valide.",
  RESET_ERROR: "Une erreur s'est produite lors de l'envoi de l'e-mail de réinitialisation. Veuillez réessayer plus tard."
};

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();
  const { darkMode } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      console.error("Erreur de connexion:", error);
      setError(ERROR_MESSAGES.LOGIN_FAILED);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError(ERROR_MESSAGES.EMPTY_EMAIL);
      return;
    }
    try {
      setError('');
      setResetEmailSent(false);
      await resetPassword(email);
      setResetEmailSent(true);
    } catch (error) {
      console.error("Erreur de réinitialisation du mot de passe:", error);
      if (error.code === 'auth/user-not-found') {
        setError(ERROR_MESSAGES.USER_NOT_FOUND);
      } else if (error.code === 'auth/invalid-email') {
        setError(ERROR_MESSAGES.INVALID_EMAIL);
      } else {
        setError(ERROR_MESSAGES.RESET_ERROR);
      }
    }
  };

  const bgClass = darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900';
  const inputClass = `appearance-none rounded-lg relative block w-full px-3 py-2 border ${
    darkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'
  } placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm`;
  const buttonClass = `group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150 ease-in-out`;

  return (
    <div className={`min-h-screen flex items-center justify-center ${bgClass} py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-md w-full space-y-8">
        <div>
          <img className="mx-auto h-32 w-auto" src={logo} alt="DevisApp Logo" />
          <h2 className="mt-6 text-center text-3xl font-extrabold bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text">
            Connexion à votre compte
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="email-address" className="sr-only">Adresse e-mail</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`${inputClass} pl-10`}
                  placeholder="Adresse e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Mot de passe</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className={`${inputClass} pl-10`}
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          {error && <div className="text-red-500 text-sm text-center bg-red-100 border border-red-400 rounded-lg p-2">{error}</div>}
          {resetEmailSent && <div className="text-green-500 text-sm text-center bg-green-100 border border-green-400 rounded-lg p-2">Un e-mail de réinitialisation a été envoyé à votre adresse.</div>}

          <div>
            <button type="submit" className={buttonClass}>
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LockClosedIcon className="h-5 w-5 text-teal-500 group-hover:text-teal-400" aria-hidden="true" />
              </span>
              Se connecter
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <button
            onClick={handleResetPassword}
            className="font-medium text-teal-600 hover:text-teal-500 transition duration-150 ease-in-out"
          >
            Mot de passe oublié ?
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;