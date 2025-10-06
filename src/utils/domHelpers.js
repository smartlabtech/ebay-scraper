/**
 * Safely get className as a string from any element (HTML or SVG)
 * @param {Element} element - DOM element
 * @returns {string} - className as string
 */
export const getClassNameString = (element) => {
  if (!element || !element.className) return '';
  
  // Handle SVGAnimatedString (SVG elements)
  if (typeof element.className === 'object' && element.className.baseVal !== undefined) {
    return element.className.baseVal || '';
  }
  
  // Handle regular HTML elements
  return element.className || '';
};

/**
 * Check if an element has a specific class
 * @param {Element} element - DOM element
 * @param {string} className - Class name to check
 * @returns {boolean}
 */
export const hasClass = (element, className) => {
  const classString = getClassNameString(element);
  return classString.includes(className);
};

/**
 * Safe event handler wrapper that prevents errors with SVG elements
 * @param {Function} handler - Event handler function
 * @returns {Function} - Wrapped handler
 */
export const safeEventHandler = (handler) => {
  return (event) => {
    try {
      // Ensure className is always a string
      if (event.target && event.target.className) {
        const originalClassName = event.target.className;
        if (typeof originalClassName === 'object' && originalClassName.baseVal !== undefined) {
          // Temporarily add a string className property for compatibility
          Object.defineProperty(event.target, '_className', {
            value: originalClassName,
            writable: true,
            configurable: true
          });
          Object.defineProperty(event.target, 'className', {
            get() { return this._className.baseVal || ''; },
            set(val) { if (this._className.baseVal !== undefined) this._className.baseVal = val; },
            configurable: true
          });
        }
      }
      return handler(event);
    } catch (error) {
      console.error('Event handler error:', error);
      // Prevent the error from breaking the app
      event.preventDefault();
      event.stopPropagation();
    }
  };
};