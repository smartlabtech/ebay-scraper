import { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectKeyboardShortcuts } from '../store/slices/uiSlice';

// Hook for single key press
export const useKeyPress = (targetKey, handler, options = {}) => {
  const {
    ctrlKey = false,
    shiftKey = false,
    altKey = false,
    metaKey = false,
    preventDefault = true,
    enableOnInput = false
  } = options;

  const keyboardShortcutsEnabled = useSelector(selectKeyboardShortcuts);
  const handlerRef = useRef(handler);

  // Update handler ref on each render
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!keyboardShortcutsEnabled) return;

    const handleKeyDown = (event) => {
      // Skip if in input/textarea and not explicitly enabled
      if (!enableOnInput) {
        const tagName = event.target.tagName.toLowerCase();
        if (tagName === 'input' || tagName === 'textarea' || event.target.contentEditable === 'true') {
          return;
        }
      }

      // Check if the pressed key matches
      const keyMatch = event.key.toLowerCase() === targetKey.toLowerCase() ||
                      event.code.toLowerCase() === targetKey.toLowerCase();

      if (!keyMatch) return;

      // Check modifier keys
      if (ctrlKey !== event.ctrlKey) return;
      if (shiftKey !== event.shiftKey) return;
      if (altKey !== event.altKey) return;
      if (metaKey !== event.metaKey) return;

      if (preventDefault) {
        event.preventDefault();
      }

      handlerRef.current(event);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [targetKey, ctrlKey, shiftKey, altKey, metaKey, preventDefault, enableOnInput, keyboardShortcutsEnabled]);
};

// Hook for multiple key combinations
export const useKeyboardShortcuts = (shortcuts) => {
  const keyboardShortcutsEnabled = useSelector(selectKeyboardShortcuts);
  const shortcutsRef = useRef(shortcuts);

  // Update shortcuts ref on each render
  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  useEffect(() => {
    if (!keyboardShortcutsEnabled) return;

    const handleKeyDown = (event) => {
      // Check if in input/textarea
      const tagName = event.target.tagName.toLowerCase();
      const isInput = tagName === 'input' || tagName === 'textarea' || event.target.contentEditable === 'true';

      shortcutsRef.current.forEach(shortcut => {
        const {
          key,
          ctrlKey = false,
          shiftKey = false,
          altKey = false,
          metaKey = false,
          handler,
          preventDefault = true,
          enableOnInput = false
        } = shortcut;

        // Skip if in input and not enabled
        if (isInput && !enableOnInput) return;

        // Check key match
        const keyMatch = event.key.toLowerCase() === key.toLowerCase() ||
                        event.code.toLowerCase() === key.toLowerCase();

        if (!keyMatch) return;

        // Check modifiers
        if (ctrlKey !== event.ctrlKey) return;
        if (shiftKey !== event.shiftKey) return;
        if (altKey !== event.altKey) return;
        if (metaKey !== event.metaKey) return;

        if (preventDefault) {
          event.preventDefault();
        }

        handler(event);
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keyboardShortcutsEnabled]);
};

// Hook for detecting any key press
export const useAnyKeyPress = () => {
  const [keyPressed, setKeyPressed] = useState(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      setKeyPressed({
        key: event.key,
        code: event.code,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        altKey: event.altKey,
        metaKey: event.metaKey
      });
    };

    const handleKeyUp = () => {
      setKeyPressed(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keyPressed;
};

// Common keyboard shortcuts
export const useCommonShortcuts = ({
  onSave,
  onNew,
  onDelete,
  onSearch,
  onEscape,
  onUndo,
  onRedo
}) => {
  const shortcuts = [];

  if (onSave) {
    shortcuts.push({ key: 's', ctrlKey: true, handler: onSave });
  }
  if (onNew) {
    shortcuts.push({ key: 'n', ctrlKey: true, handler: onNew });
  }
  if (onDelete) {
    shortcuts.push({ key: 'Delete', handler: onDelete });
  }
  if (onSearch) {
    shortcuts.push({ key: 'f', ctrlKey: true, handler: onSearch });
  }
  if (onEscape) {
    shortcuts.push({ key: 'Escape', handler: onEscape });
  }
  if (onUndo) {
    shortcuts.push({ key: 'z', ctrlKey: true, handler: onUndo });
  }
  if (onRedo) {
    shortcuts.push({ key: 'y', ctrlKey: true, handler: onRedo });
    shortcuts.push({ key: 'z', ctrlKey: true, shiftKey: true, handler: onRedo });
  }

  useKeyboardShortcuts(shortcuts);
};