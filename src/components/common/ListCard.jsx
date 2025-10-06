import { Card, Stack, Group, Box, Text, Menu, ActionIcon, Badge } from '@mantine/core';
import { MdMoreVert as IconDots, MdCalendarToday as IconCalendar } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { safeEventHandler } from '../../utils/domHelpers';

/**
 * Reusable List Card Component
 * 
 * @param {Object} props
 * @param {string} props.navigateTo - Path to navigate when card is clicked
 * @param {React.ReactNode} props.header - Header content (title, badges, etc.)
 * @param {React.ReactNode} props.content - Main card content
 * @param {Date|string} props.date - Date to display in footer
 * @param {Array} props.menuItems - Menu dropdown items [{icon, label, onClick, color}]
 * @param {React.ReactNode} props.footerLeft - Additional content for footer left side
 * @param {Function} props.onCardClick - Optional custom click handler (overrides navigation)
 * @param {Object} props.cardProps - Additional props to pass to Card component
 */
const ListCard = ({ 
  navigateTo,
  header,
  content,
  date,
  menuItems = [],
  footerLeft,
  onCardClick,
  cardProps = {},
  children
}) => {
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    // Prevent navigation when clicking on interactive elements
    // Check if the clicked element or its parent is an interactive element
    const interactiveElements = ['button', '[data-menu]', 'a', 'input', 'select', 'textarea'];
    
    for (const selector of interactiveElements) {
      if (e.target.closest(selector)) {
        return;
      }
    }
    
    // Also check if clicking on an element with onClick handler
    if (e.target.onclick || e.defaultPrevented) {
      return;
    }
    
    if (onCardClick) {
      onCardClick(e);
    } else if (navigateTo) {
      navigate(navigateTo);
    }
  };

  return (
    <Card
      shadow="sm"
      p="lg"
      radius="lg"
      withBorder
      onClick={safeEventHandler(handleCardClick)}
      style={{
        borderColor: 'transparent',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: navigateTo || onCardClick ? 'pointer' : 'default',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        ...cardProps.style
      }}
      sx={(theme) => ({
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: `linear-gradient(90deg, ${theme.colors.violet[5]} 0%, ${theme.colors.grape[5]} 100%)`,
          transform: 'translateX(-100%)',
          transition: 'transform 0.3s ease'
        },
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: theme.colors.violet[3],
          boxShadow: '0 20px 40px -15px rgba(124, 58, 237, 0.15)',
          '&::before': {
            transform: 'translateX(0)'
          }
        },
        ...cardProps.sx
      })}
      {...cardProps}
    >
      <Stack gap="md" h="100%">
        {/* Header with optional menu */}
        {(header || menuItems.length > 0) && (
          <Group justify="space-between" align="flex-start">
            <Box style={{ flex: 1, minWidth: 0 }}>
              {header}
            </Box>
            {menuItems.length > 0 && (
              <Menu withinPortal position="bottom-end" data-menu>
                <Menu.Target>
                  <ActionIcon variant="subtle" size="sm">
                    <IconDots size={18} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  {menuItems.map((item, index) => (
                    <Menu.Item
                      key={index}
                      leftSection={item.icon}
                      color={item.color}
                      onClick={item.onClick}
                    >
                      {item.label}
                    </Menu.Item>
                  ))}
                </Menu.Dropdown>
              </Menu>
            )}
          </Group>
        )}

        {/* Main content */}
        {content && <Box style={{ flex: 1 }}>{content}</Box>}
        
        {/* Children for custom content */}
        {children}

        {/* Flexible spacer to push footer to bottom */}
        <Box style={{ flex: 1 }} />

        {/* Footer */}
        {(date || footerLeft || navigateTo || onCardClick) && (
          <Group justify="space-between" align="center">
            <Group gap="xs">
              {date && (
                <Text size="xs" c="dimmed">
                  <IconCalendar size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                  {format(new Date(date), 'MMM d, yyyy')}
                </Text>
              )}
              {footerLeft}
            </Group>
            {(navigateTo || onCardClick) && (
              <Text size="xs" c="dimmed" style={{ opacity: 0.6 }}>
                Click to view →
              </Text>
            )}
          </Group>
        )}
      </Stack>
    </Card>
  );
};

export default ListCard;