import React, { useEffect, useRef } from 'react';

const SIZE = 75

export const Button = ({ s, onClick }) => {
  return (
    <button style={{ width: SIZE, height: SIZE }} onClick={onClick}>
      { s }
    </button>
  )
}

export function HoldButton({ onPress, onRelease, s }) {
  const buttonRef = useRef(null);

  useEffect(() => {
    const handlePress = (e) => {
      if (onPress) onPress(e);
    };

    const handleRelease = (e) => {
      if (onRelease) onRelease(e);
    };

    const button = buttonRef.current;

    // Attach event listeners for both desktop and mobile
    button.addEventListener('mousedown', handlePress);
    button.addEventListener('mouseup', handleRelease);
    button.addEventListener('touchstart', handlePress);
    button.addEventListener('touchend', handleRelease);

    return () => {
      // Cleanup
      button.removeEventListener('mousedown', handlePress);
      button.removeEventListener('mouseup', handleRelease);
      button.removeEventListener('touchstart', handlePress);
      button.removeEventListener('touchend', handleRelease);
    };
  }, [onPress, onRelease]);

  return (
    <button style={{ width: SIZE, height: SIZE }} ref={buttonRef}>
      { s }
    </button>
  );
}
