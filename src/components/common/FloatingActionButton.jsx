import { ActionIcon, Affix, Transition, Group, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

// Add CSS animation to document head
const addPulseAnimation = () => {
  const styleId = 'fab-pulse-animation';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes fabPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.03); }
        100% { transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
  }
};

const FloatingActionButton = ({
  to,
  icon: Icon,
  label,
  iconSize = 20,
  position = { bottom: 20, right: 20 },
  hidden = false
}) => {
  useEffect(() => {
    addPulseAnimation();
  }, []);

  // Only render the button when not hidden
  if (hidden) {
    return null;
  }

  return (
    <Affix position={position}>
      <Transition
        transition="slide-up"
        mounted={true}
        duration={400}
      >
        {(transitionStyles) => (
          <ActionIcon
            component={Link}
            to={to}
            size="auto"
            radius="xl"
            variant="gradient"
            gradient={{ from: 'violet', to: 'grape', deg: 135 }}
            style={{
              ...transitionStyles,
              padding: '12px 20px',
              height: 'auto',
              width: 'auto',
              animation: 'fabPulse 2s ease-in-out infinite',
              opacity: 0.8,
            }}
            styles={{
              root: {
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.08)',
                  boxShadow: '0 6px 28px rgba(124, 58, 237, 0.4)',
                  animationPlayState: 'paused',
                  opacity: 1,
                }
              }
            }}
          >
            <Group gap="xs" wrap="nowrap">
              <Icon size={iconSize} style={{ color: 'white' }} />
              <Text size="sm" fw={600} c="white">
                {label}
              </Text>
            </Group>
          </ActionIcon>
        )}
      </Transition>
    </Affix>
  );
};

export default FloatingActionButton;