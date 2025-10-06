/**
 * Animation Helpers
 * Reusable animation utilities based on Landing1 design
 */

// CSS Keyframe Animations
export const keyframes = {
  // Floating animation for decorative elements
  float: `
    @keyframes float {
      0%, 100% {
        transform: translateY(0) rotate(0deg);
      }
      33% {
        transform: translateY(-30px) rotate(120deg);
      }
      66% {
        transform: translateY(20px) rotate(240deg);
      }
    }
  `,

  // Pulse animation for badges/alerts
  pulse: `
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.7;
        transform: scale(1.05);
      }
    }
  `,

  // Fade in up for content reveal
  fadeInUp: `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,

  // Slide in from left
  slideInLeft: `
    @keyframes slideInLeft {
      from {
        transform: translateX(-100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `,

  // Slide in from right
  slideInRight: `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `,

  // Scale in
  scaleIn: `
    @keyframes scaleIn {
      from {
        transform: scale(0.9);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }
  `,

  // Glow effect
  glow: `
    @keyframes glow {
      0%, 100% {
        box-shadow: 0 0 5px rgba(30, 64, 175, 0.5);
      }
      50% {
        box-shadow: 0 0 20px rgba(30, 64, 175, 0.8);
      }
    }
  `,

  // Shimmer effect for loading states
  shimmer: `
    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }
  `,

  // Bounce animation
  bounce: `
    @keyframes bounce {
      0%, 100% {
        transform: translateY(0);
      }
      25% {
        transform: translateY(-20px);
      }
      50% {
        transform: translateY(-10px);
      }
      75% {
        transform: translateY(-15px);
      }
    }
  `,

  // Rotate animation
  rotate: `
    @keyframes rotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `
}

// Animation classes with timing
export const animationClasses = {
  fadeInUp: {
    animation: 'fadeInUp 0.8s ease both'
  },
  fadeInUpFast: {
    animation: 'fadeInUp 0.5s ease both'
  },
  fadeInUpSlow: {
    animation: 'fadeInUp 1.2s ease both'
  },
  slideInLeft: {
    animation: 'slideInLeft 0.6s ease both'
  },
  slideInRight: {
    animation: 'slideInRight 0.6s ease both'
  },
  scaleIn: {
    animation: 'scaleIn 0.5s ease both'
  },
  pulse: {
    animation: 'pulse 2s infinite ease-in-out'
  },
  float: {
    animation: 'float 20s ease-in-out infinite'
  },
  glow: {
    animation: 'glow 2s ease-in-out infinite'
  },
  bounce: {
    animation: 'bounce 2s ease-in-out infinite'
  },
  rotate: {
    animation: 'rotate 2s linear infinite'
  }
}

// Stagger animation delays for lists
export const getStaggerDelay = (index, baseDelay = 0.1) => ({
  animationDelay: `${index * baseDelay}s`
})

// Scroll-triggered animation observer
export const createScrollAnimationObserver = (options = {}) => {
  const defaultOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
    animationClass: 'visible',
    ...options
  }

  if (typeof window === 'undefined') return null

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add(defaultOptions.animationClass)
        if (options.once) {
          observer.unobserve(entry.target)
        }
      } else if (!options.once) {
        entry.target.classList.remove(defaultOptions.animationClass)
      }
    })
  }, {
    threshold: defaultOptions.threshold,
    rootMargin: defaultOptions.rootMargin
  })

  return {
    observe: (element) => {
      if (element) observer.observe(element)
    },
    unobserve: (element) => {
      if (element) observer.unobserve(element)
    },
    disconnect: () => observer.disconnect()
  }
}

// Hover animation helpers
export const hoverEffects = {
  // Lift up on hover
  lift: {
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
    }
  },

  // Scale up on hover
  scale: {
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)'
    }
  },

  // Glow on hover
  glow: {
    transition: 'box-shadow 0.3s ease',
    '&:hover': {
      boxShadow: '0 0 20px rgba(30, 64, 175, 0.3)'
    }
  },

  // Border color change on hover
  borderColor: (color = '#1e40af') => ({
    transition: 'border-color 0.3s ease',
    '&:hover': {
      borderColor: color
    }
  }),

  // Background fade on hover
  bgFade: (fromColor = 'transparent', toColor = 'rgba(30, 64, 175, 0.1)') => ({
    transition: 'background-color 0.3s ease',
    background: fromColor,
    '&:hover': {
      background: toColor
    }
  })
}

// Transition presets
export const transitions = {
  fast: '0.15s ease',
  base: '0.3s ease',
  slow: '0.5s ease',
  bounce: '0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  smooth: '0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  // Specific property transitions
  all: 'all 0.3s ease',
  transform: 'transform 0.3s ease',
  opacity: 'opacity 0.3s ease',
  colors: 'background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease',
  shadow: 'box-shadow 0.3s ease'
}

// Animation CSS generator
export const generateAnimationCSS = () => {
  return Object.values(keyframes).join('\n')
}

// Parallax effect helper
export const createParallaxEffect = (speed = 0.5) => {
  if (typeof window === 'undefined') return null

  const handleScroll = (element) => {
    const scrolled = window.pageYOffset
    const rate = scrolled * speed

    if (element) {
      element.style.transform = `translateY(${rate}px)`
    }
  }

  return handleScroll
}

// Loading animation styles
export const loadingAnimations = {
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid rgba(30, 64, 175, 0.1)',
    borderTop: '4px solid #1e40af',
    borderRadius: '50%',
    animation: 'rotate 1s linear infinite'
  },

  shimmer: {
    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite'
  },

  pulse: {
    background: '#e0e0e0',
    animation: 'pulse 1.5s ease-in-out infinite'
  }
}

// Scroll to element with animation
export const smoothScrollTo = (elementId, offset = 0) => {
  const element = document.getElementById(elementId)
  if (element) {
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

// Export all animation utilities
export const animationUtils = {
  keyframes,
  animationClasses,
  getStaggerDelay,
  createScrollAnimationObserver,
  hoverEffects,
  transitions,
  generateAnimationCSS,
  createParallaxEffect,
  loadingAnimations,
  smoothScrollTo
}

export default animationUtils