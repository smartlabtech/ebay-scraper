import { useState, useEffect } from 'react';
import {
  Box,
  Stack,
  Group,
  Text,
  Badge,
  Modal,
  Card,
  ThemeIcon,
  Alert,
  List,
  Divider,
  Paper,
  SimpleGrid,
  Tooltip,
  Drawer,
  ActionIcon,
  ScrollArea,
  UnstyledButton
} from '@mantine/core';
import {
  MdInfo as IconInfo,
  MdLightbulb as IconBulb,
  MdWarning as IconWarning,
  MdCheck as IconCheck,
  MdTrendingUp as IconTrending,
  MdDevices as IconDevices,
  MdSmartphone as IconMobile,
  MdComputer as IconDesktop,
  MdAutoAwesome as IconSparkle,
  MdEdit as IconEdit
} from 'react-icons/md';
import { 
  PLATFORM_GROUPS,
  PLATFORMS,
  getPlatformDetails,
  formatPlatformName,
  getPlatformBestPractices,
  getPlatformLimitations
} from '../../services/copyService';

const PlatformSelector = ({ 
  value, 
  onChange,
  copyType 
}) => {
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [platformModalOpen, setPlatformModalOpen] = useState(false);
  const [selectedPlatformDetails, setSelectedPlatformDetails] = useState(null);

  // Get platform details when selected
  useEffect(() => {
    if (value) {
      const details = getPlatformDetails(value);
      setSelectedPlatformDetails(details);
    }
  }, [value]);

  // Get platform category color - simplified to single accent
  const getCategoryColor = (category) => {
    // Only use color for selected state
    return 'violet';
  };

  // Get platform category from value
  const getPlatformCategory = (platformValue) => {
    for (const [category, platforms] of Object.entries(PLATFORM_GROUPS)) {
      if (platforms.some(p => p.value === platformValue)) {
        return category;
      }
    }
    return null;
  };

  const currentCategory = value ? getPlatformCategory(value) : null;

  // Handle platform selection
  const handlePlatformSelect = (platformValue) => {
    onChange(platformValue);
    setPlatformModalOpen(false);
  };

  return (
    <>
      <Stack gap="md">
        {/* Platform Selection */}
        <Box>
          <Group justify="space-between" mb="xs">
            <Text size="sm" fw={500}>Platform</Text>
            {value && currentCategory && (
              <Group gap={4}>
                <Badge size="xs" variant="dot" color={getCategoryColor(currentCategory)}>
                  {currentCategory}
                </Badge>
                <Tooltip label="View platform details and best practices">
                  <ActionIcon 
                    size="xs" 
                    variant="subtle" 
                    color="violet"
                    onClick={() => setDetailsDrawerOpen(true)}
                    styles={{
                      root: {
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                          '0%': {
                            transform: 'scale(1)',
                            opacity: 1,
                          },
                          '50%': {
                            transform: 'scale(1.1)',
                            opacity: 0.7,
                          },
                          '100%': {
                            transform: 'scale(1)',
                            opacity: 1,
                          },
                        },
                      },
                    }}
                  >
                    <IconSparkle size={14} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            )}
          </Group>
          
          <UnstyledButton 
            onClick={() => setPlatformModalOpen(true)}
            style={{ width: '100%' }}
          >
            <Paper
              p="md"
              radius="md"
              withBorder
              style={{ 
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: '2px solid var(--mantine-color-gray-3)'
              }}
              sx={(theme) => ({
                '&:hover': {
                  borderColor: theme.colors.violet[4],
                  backgroundColor: theme.colors.gray[0]
                }
              })}
            >
              {value ? (
                <Group justify="space-between">
                  <Box>
                    <Text size="xs" c="dimmed" mb={2}>Selected Platform</Text>
                    <Text size="sm" fw={600}>
                      {formatPlatformName(value)}
                    </Text>
                  </Box>
                  <IconEdit size={18} color="var(--mantine-color-gray-6)" />
                </Group>
              ) : (
                <Group justify="space-between">
                  <Box>
                    <Text size="sm" fw={500}>Select Platform</Text>
                    <Text size="xs" c="dimmed" mt={2}>
                      {copyType ? 
                        `Choose where your ${copyType.toLowerCase()} content will be published` :
                        'Click to browse available platforms'
                      }
                    </Text>
                  </Box>
                  <IconDevices size={20} color="var(--mantine-color-gray-6)" />
                </Group>
              )}
            </Paper>
          </UnstyledButton>
        </Box>
      </Stack>

      {/* Details Drawer */}
      <Drawer
        opened={detailsDrawerOpen}
        onClose={() => setDetailsDrawerOpen(false)}
        title={
          <Group gap="xs">
            <Text size="lg" fw={600}>
              {selectedPlatformDetails?.icon} {value && formatPlatformName(value)} Guide
            </Text>
            <Badge size="sm" variant="filled" color={getCategoryColor(currentCategory)}>
              {currentCategory}
            </Badge>
          </Group>
        }
        size="lg"
        position="right"
        scrollAreaComponent={ScrollArea.Autosize}
      >
        {selectedPlatformDetails && (
          <Stack gap="lg">
            {/* Platform Guidance Panel */}
            <Card withBorder radius="md" p="md">
              <Stack gap="sm">

                {/* Quick Info */}
                <SimpleGrid cols={3} spacing="xs">
                  {selectedPlatformDetails.characterLimit && (
                    <Paper p="xs" withBorder>
                      <Text size="xs" c="dimmed" mb={2}>Character Limit</Text>
                      <Text size="sm" fw={500}>{selectedPlatformDetails.characterLimit}</Text>
                    </Paper>
                  )}
                  {selectedPlatformDetails.idealLength && (
                    <Paper p="xs" withBorder>
                      <Text size="xs" c="dimmed" mb={2}>Ideal Length</Text>
                      <Text size="sm" fw={500}>{selectedPlatformDetails.idealLength}</Text>
                    </Paper>
                  )}
                  {selectedPlatformDetails.mediaSupport && (
                    <Paper p="xs" withBorder>
                      <Text size="xs" c="dimmed" mb={2}>Media</Text>
                      <Text size="sm" fw={500}>{selectedPlatformDetails.mediaSupport}</Text>
                    </Paper>
                  )}
                </SimpleGrid>

                <Stack gap="md" pt="sm">
                  <Divider />
                    
                    {/* Platform Overview */}
                    <Box>
                      <Group gap="xs" mb="xs">
                        <ThemeIcon size="sm" variant="light" color="blue">
                          <IconDevices size={14} />
                        </ThemeIcon>
                        <Text size="sm" fw={500}>Platform Overview</Text>
                      </Group>
                      <Text size="sm" c="dimmed">
                        {selectedPlatformDetails.overview}
                      </Text>
                    </Box>

                    {/* Best Practices */}
                    {selectedPlatformDetails.bestPractices && (
                      <Box>
                        <Group gap="xs" mb="xs">
                          <ThemeIcon size="sm" variant="light" color="green">
                            <IconCheck size={14} />
                          </ThemeIcon>
                          <Text size="sm" fw={500}>Best Practices</Text>
                        </Group>
                        <List size="sm" spacing="xs">
                          {selectedPlatformDetails.bestPractices.map((practice, idx) => (
                            <List.Item key={idx}>
                              <Text size="sm">{practice}</Text>
                            </List.Item>
                          ))}
                        </List>
                      </Box>
                    )}

                    {/* Content Format */}
                    {selectedPlatformDetails.contentFormat && (
                      <Box>
                        <Group gap="xs" mb="xs">
                          <ThemeIcon size="sm" variant="light" color="violet">
                            <IconBulb size={14} />
                          </ThemeIcon>
                          <Text size="sm" fw={500}>Content Format</Text>
                        </Group>
                        <Stack gap="xs">
                          {Object.entries(selectedPlatformDetails.contentFormat).map(([key, value], idx) => (
                            <Paper key={idx} p="xs" withBorder>
                              <Text size="xs" c="dimmed" mb={2}>
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </Text>
                              <Text size="sm">{value}</Text>
                            </Paper>
                          ))}
                        </Stack>
                      </Box>
                    )}

                    {/* Hashtag Strategy */}
                    {selectedPlatformDetails.hashtagStrategy && (
                      <Box>
                        <Group gap="xs" mb="xs">
                          <ThemeIcon size="sm" variant="light" color="cyan">
                            <IconTrending size={14} />
                          </ThemeIcon>
                          <Text size="sm" fw={500}>Hashtag Strategy</Text>
                        </Group>
                        <Text size="sm" c="dimmed">
                          {selectedPlatformDetails.hashtagStrategy}
                        </Text>
                      </Box>
                    )}

                    {/* Limitations */}
                    {selectedPlatformDetails.limitations && (
                      <Box>
                        <Group gap="xs" mb="xs">
                          <ThemeIcon size="sm" variant="light" color="red">
                            <IconWarning size={14} />
                          </ThemeIcon>
                          <Text size="sm" fw={500}>Limitations & Restrictions</Text>
                        </Group>
                        <List size="sm" spacing="xs">
                          {selectedPlatformDetails.limitations.map((limitation, idx) => (
                            <List.Item key={idx} icon={
                              <ThemeIcon size="xs" color="red" variant="light">
                                <IconWarning size={10} />
                              </ThemeIcon>
                            }>
                              <Text size="sm" c="dimmed">{limitation}</Text>
                            </List.Item>
                          ))}
                        </List>
                      </Box>
                    )}

                    {/* Audience Demographics */}
                    {selectedPlatformDetails.audience && (
                      <Box>
                        <Group gap="xs" mb="xs">
                          <ThemeIcon size="sm" variant="light" color="grape">
                            <IconInfo size={14} />
                          </ThemeIcon>
                          <Text size="sm" fw={500}>Typical Audience</Text>
                        </Group>
                        <Text size="sm" c="dimmed">
                          {selectedPlatformDetails.audience}
                        </Text>
                      </Box>
                    )}
                </Stack>
              </Stack>
            </Card>

            {/* Copy Type Compatibility */}
            {copyType && selectedPlatformDetails?.recommendedCopyTypes && (
              <Alert
                icon={<IconInfo size={16} />}
                color={selectedPlatformDetails.recommendedCopyTypes.includes(copyType) ? 'green' : 'yellow'}
                variant="light"
              >
                <Text size="sm">
                  {selectedPlatformDetails.recommendedCopyTypes.includes(copyType) ? (
                    <>
                      <strong>Great Match!</strong> {copyType} content performs well on {formatPlatformName(value)}.
                      {selectedPlatformDetails.copyTypeAdvice?.[copyType] && (
                        <Text size="xs" c="dimmed" mt={4}>
                          {selectedPlatformDetails.copyTypeAdvice[copyType]}
                        </Text>
                      )}
                    </>
                  ) : (
                    <>
                      <strong>Consider:</strong> {copyType} content may need adaptation for {formatPlatformName(value)}.
                      Focus on {selectedPlatformDetails.contentApproach || 'platform-specific best practices'}.
                    </>
                  )}
                </Text>
              </Alert>
            )}

            {/* Mobile vs Desktop Optimization */}
            {selectedPlatformDetails?.deviceOptimization && (
              <Alert
                icon={selectedPlatformDetails.deviceOptimization === 'mobile' ? <IconMobile size={16} /> : <IconDesktop size={16} />}
                color="blue"
                variant="light"
              >
                <Text size="sm">
                  <strong>Optimize for {selectedPlatformDetails.deviceOptimization}:</strong> {
                    selectedPlatformDetails.deviceOptimization === 'mobile' 
                      ? 'Most users will view this on mobile devices. Keep text concise and use vertical formats.'
                      : 'This platform is primarily accessed on desktop. You can use longer-form content and horizontal layouts.'
                  }
                </Text>
              </Alert>
            )}
          </Stack>
        )}
      </Drawer>

      {/* Platform Selection Modal - Clean Professional Design */}
      <Modal
        opened={platformModalOpen}
        onClose={() => setPlatformModalOpen(false)}
        title={
          <Text size="lg" fw={600}>Choose Platform</Text>
        }
        size="lg"
        centered
        overlayProps={{ opacity: 0.55, blur: 3 }}
        styles={{
          title: {
            fontWeight: 600
          },
          header: {
            borderBottom: '1px solid var(--mantine-color-gray-2)'
          }
        }}
      >
        <ScrollArea h={450} offsetScrollbars>
          <Stack gap={0}>
            {Object.entries(PLATFORM_GROUPS).map(([category, platforms], index) => (
              <Box key={category}>
                {/* Category Header */}
                <Box 
                  px="md" 
                  py={6} 
                  bg="gray.0"
                  style={{ 
                    borderTop: index > 0 ? '1px solid var(--mantine-color-gray-2)' : 'none',
                    marginTop: index > 0 ? 'sm' : 0
                  }}
                >
                  <Text size="xs" c="gray.6" fw={500} tt="uppercase" style={{ letterSpacing: '0.5px' }}>
                    {category}
                  </Text>
                </Box>
                
                {/* Platform Chips */}
                <Box px="md" py="xs">
                  <Group gap={6}>
                    {platforms.map(platform => (
                      <UnstyledButton
                        key={platform.value}
                        onClick={() => handlePlatformSelect(platform.value)}
                      >
                        <Paper
                          px="sm"
                          py={4}
                          radius="xl"
                          bg={value === platform.value ? "violet.6" : "white"}
                          style={{
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            border: value === platform.value 
                              ? '1px solid var(--mantine-color-violet-6)' 
                              : '1px solid var(--mantine-color-gray-3)'
                          }}
                          sx={(theme) => ({
                            '&:hover': {
                              backgroundColor: value === platform.value 
                                ? theme.colors.violet[7]
                                : theme.colors.gray[0],
                              borderColor: value === platform.value 
                                ? theme.colors.violet[7]
                                : theme.colors.gray[4]
                            }
                          })}
                        >
                          <Group gap={4} wrap="nowrap">
                            {value === platform.value && (
                              <IconCheck size={12} color="white" />
                            )}
                            <Text 
                              size="xs" 
                              fw={value === platform.value ? 500 : 400}
                              c={value === platform.value ? "white" : "dark"}
                            >
                              {platform.label}
                            </Text>
                          </Group>
                        </Paper>
                      </UnstyledButton>
                    ))}
                  </Group>
                </Box>
              </Box>
            ))}
          </Stack>
        </ScrollArea>
        
        {/* Footer with selected platform */}
        {value && (
          <Box 
            pt="md" 
            mt="md" 
            style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}
          >
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Selected: <Text span fw={500}>{formatPlatformName(value)}</Text>
              </Text>
              <Badge size="sm" variant="light" color="violet">
                {getPlatformCategory(value)}
              </Badge>
            </Group>
          </Box>
        )}
      </Modal>
    </>
  );
};

export default PlatformSelector;