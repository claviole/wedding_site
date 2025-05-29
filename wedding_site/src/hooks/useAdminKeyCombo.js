import { useState, useEffect } from "react";

const useAdminKeyCombo = () => {
  const [pressedKeys, setPressedKeys] = useState(new Set());
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      setPressedKeys((prev) => new Set([...prev, event.key.toLowerCase()]));
    };

    const handleKeyUp = (event) => {
      setPressedKeys((prev) => {
        const newSet = new Set(prev);
        newSet.delete(event.key.toLowerCase());
        return newSet;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Separate useEffect to check for the key combination
  useEffect(() => {
    const requiredKeys = ["a", "d", "m", "i"];
    const hasAllKeys = requiredKeys.every((key) => pressedKeys.has(key));

    if (hasAllKeys && pressedKeys.size === 4) {
      setAdminMenuOpen(true);
      setPressedKeys(new Set()); // Clear pressed keys
    }
  }, [pressedKeys]);

  return { adminMenuOpen, setAdminMenuOpen };
};

export default useAdminKeyCombo;
