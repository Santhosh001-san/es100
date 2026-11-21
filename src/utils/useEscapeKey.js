import { useEffect } from 'react';

/**
 * Custom hook to handle Escape key press for accessible closing of modals/popups.
 * @param {Function} onClose - Handler to call when Escape is pressed
 * @param {boolean} isOpen - Whether the modal/popup is currently open
 */
export const useEscapeKey = (onClose, isOpen = true) => {
  useEffect(() => {
    if (!isOpen || !onClose) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, isOpen]);
};
