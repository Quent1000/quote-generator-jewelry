export const formatPhoneNumber = (phoneNumber) => {
  // Supprime tous les caractères non numériques
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  
  // Vérifie si le numéro a 10 chiffres
  const match = cleaned.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
  
  if (match) {
    return match.slice(1).join(' ');
  }
  
  // Si le numéro n'a pas 10 chiffres, retourne le numéro original
  return phoneNumber;
};