import React from 'react';
import { XMarkIcon, ArrowUpTrayIcon, StarIcon } from '@heroicons/react/24/outline';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_IMAGES = 10;

const ImagesDevis = ({ 
  images, 
  mainImageId, 
  onDrop,  // Assurez-vous que cette prop est bien passée
  removeImage, 
  setAsMainImage, 
  getRootProps, 
  getInputProps, 
  isDragActive, 
  handlePaste, 
  darkMode 
}) => {
  const dropzoneClass = `p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
    isDragActive 
      ? 'border-teal-500 bg-teal-50 dark:bg-teal-900' 
      : darkMode
        ? 'border-gray-600 hover:border-teal-500 bg-gray-800'
        : 'border-gray-300 hover:border-teal-500 bg-white'
  }`;

  const imageContainerClass = `relative group ${
    darkMode ? 'bg-gray-800' : 'bg-white'
  }`;

  const buttonClass = `absolute p-1 rounded-full transition-opacity ${
    darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
  }`;

  const handleDrop = (acceptedFiles) => {
    const validFiles = acceptedFiles.filter(file => file.size <= MAX_FILE_SIZE);
    if (validFiles.length + images.length > MAX_IMAGES) {
      alert(`Vous ne pouvez pas ajouter plus de ${MAX_IMAGES} images.`);
      validFiles.splice(MAX_IMAGES - images.length);
    }
    onDrop(validFiles);
  };

  return (
    <div>
      <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Images du devis
      </h2>
      <div 
        {...getRootProps()} 
        className={dropzoneClass}
        onPaste={handlePaste}
      >
        <input {...getInputProps({ onDrop: handleDrop })} />
        <ArrowUpTrayIcon className={`mx-auto h-12 w-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        <p className={`mt-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Glissez et déposez des images ici, ou cliquez pour sélectionner des fichiers
        </p>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Vous pouvez aussi coller une image directement (Ctrl+V)
        </p>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Taille maximale : 5 MB par image, {MAX_IMAGES} images maximum
        </p>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {images.map((image) => (
          <div key={image.id} className={imageContainerClass}>
            <img
              src={image.preview}
              alt="Aperçu"
              className="w-full h-32 object-cover rounded-lg"
            />
            <button
              onClick={() => removeImage(image.id)}
              className={`${buttonClass} top-2 right-2 bg-red-500 text-white opacity-0 group-hover:opacity-100`}
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setAsMainImage(image.id)}
              className={`${buttonClass} bottom-2 right-2 bg-yellow-500 text-white ${
                image.id === mainImageId ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
            >
              <StarIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImagesDevis;