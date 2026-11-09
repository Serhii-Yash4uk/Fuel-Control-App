import { useState, useEffect, useCallback } from 'react';

export const useFieldsTouched = (isOpen) => {
  const [touched, setTouched] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setTouched({});
    setIsSubmitted(false);
  }, [isOpen]);

  const touchField = useCallback((name) => {
    setTouched((prev) => (prev[name] ? prev : { ...prev, [name]: true }));
  }, []);

  const handleBlur = useCallback((e) => touchField(e.target.name), [touchField]);

  const getVisibleError = (name, error) =>
    isSubmitted || touched[name] ? error : '';

  const submitAttempt = () => setIsSubmitted(true);

  return { handleBlur, touchField, getVisibleError, submitAttempt };
};
