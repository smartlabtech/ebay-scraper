import { useState, useEffect, useCallback, memo } from 'react';
import {
  Box,
  Stack,
  Group,
  Text,
  Badge,
  Card,
  ThemeIcon,
  Alert,
  List,
  Divider,
  Paper,
  SimpleGrid,
  Progress,
  Tooltip,
  Drawer,
  Modal,
  ActionIcon,
  ScrollArea,
  UnstyledButton,
  Button
} from '@mantine/core';
import {
  MdInfo as IconInfo,
  MdLightbulb as IconBulb,
  MdWarning as IconWarning,
  MdCheck as IconCheck,
  MdTrendingUp as IconTrending,
  MdPsychology as IconPsychology,
  MdTimeline as IconTimeline,
  MdAnalytics as IconAnalytics,
  MdSchool as IconEducation,
  MdAutoAwesome as IconSparkle,
  MdEdit as IconEdit,
  MdCategory as IconCategory
} from 'react-icons/md';
import { 
  COPY_TYPES,
  getCopyTypeDetails,
  getJourneyStage,
  getContentMixRecommendation,
  getCTACompatibility
} from '../../services/copyService';

const CopyTypeSelector = ({ 
  value, 
  onChange,
  platform 
}) => {
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [copyTypeModalOpen, setCopyTypeModalOpen] = useState(false);
  const [selectedTypeDetails, setSelectedTypeDetails] = useState(null);
  const [journeyStage, setJourneyStage] = useState(null);
  const [localValue, setLocalValue] = useState(value);

  // Sync local value with prop value
  useEffect(() => {
    setLocalValue(value);
  }, [value]);
  
  // Get copy type details when selected
  useEffect(() => {
    if (localValue) {
      const details = getCopyTypeDetails(localValue);
      const journey = getJourneyStage(localValue);
      setSelectedTypeDetails(details);
      setJourneyStage(journey);
    }
  }, [localValue]);


  // Handle copy type selection  
  const handleCopyTypeSelect = useCallback((copyType) => {
    // Update local state only, don't trigger parent onChange yet
    setLocalValue(copyType);
    // Drawer stays open for user to review or make another selection
  }, []);
  
  // Handle modal close - apply selection
  const handleModalClose = useCallback(() => {
    if (localValue && localValue !== value) {
      onChange(localValue);
    }
    setCopyTypeModalOpen(false);
  }, [localValue, value, onChange]);

  // Get recommended CTAs for selected copy type
  const getRecommendedCTAs = () => {
    if (!value) return [];
    const compatible = getCTACompatibility(value);
    return compatible || [];
  };

  return (
    <>
      <Stack gap="md">
        {/* Copy Type Selection */}
        <Box>
          <Group justify="space-between" mb="xs">
            <Text size="sm" fw={500}>Copy Type</Text>
            {value && (
              <Group gap={4}>
                <Badge size="xs" variant="dot" color="violet">
                  {selectedTypeDetails?.funnelStage}
                </Badge>
                <Tooltip label="View copy type guide and best practices">
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
            onClick={() => {
              setLocalValue(value); // Sync local value with current value
              setCopyTypeModalOpen(true);
            }}
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
                    <Text size="xs" c="dimmed" mb={2}>Selected Copy Type</Text>
                    <Group gap="xs">
                      <Text size="sm" fw={600}>
                        {selectedTypeDetails?.title}
                      </Text>
                      <Badge size="sm" variant="light" color="violet">
                        {selectedTypeDetails?.funnelStage}
                      </Badge>
                    </Group>
                  </Box>
                  <IconEdit size={18} color="var(--mantine-color-gray-6)" />
                </Group>
              ) : (
                <Group justify="space-between">
                  <Box>
                    <Text size="sm" fw={500}>Select Copy Type</Text>
                    <Text size="xs" c="dimmed" mt={2}>
                      Choose the goal of your content
                    </Text>
                  </Box>
                  <IconCategory size={20} color="var(--mantine-color-gray-6)" />
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
              {selectedTypeDetails?.icon} {selectedTypeDetails?.title} Guide
            </Text>
            <Badge size="sm" variant="filled" color={selectedTypeDetails?.color}>
              {selectedTypeDetails?.funnelStage}
            </Badge>
          </Group>
        }
        size="lg"
        position="right"
        scrollAreaComponent={ScrollArea.Autosize}
      >
        {selectedTypeDetails && (
          <Stack gap="lg">
            {/* Copy Type Guidance Panel */}
            <Card withBorder radius="md" p="md">
              <Stack gap="sm">

                {/* Quick Info */}
                <Box>
                  <Text size="sm" c="dimmed" mb={4}>Purpose:</Text>
                  <Text size="sm" fw={500}>{selectedTypeDetails.purpose}</Text>
                </Box>

                {/* Journey Stage */}
                {journeyStage && (
                  <Box>
                    <Group gap="xs" mb={4}>
                      <ThemeIcon size="sm" variant="light" color="cyan">
                        <IconTimeline size={14} />
                      </ThemeIcon>
                      <Text size="sm" c="dimmed">Customer Journey:</Text>
                    </Group>
                    <Paper p="xs" withBorder>
                      <Text size="sm" fw={500}>{journeyStage.stage}</Text>
                      <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                        "{journeyStage.mindset}"
                      </Text>
                    </Paper>
                  </Box>
                )}

                <Stack gap="md" pt="sm">
                  <Divider />
                    
                    {/* Psychological Framework */}
                    <Box>
                      <Group gap="xs" mb="xs">
                        <ThemeIcon size="sm" variant="light" color="violet">
                          <IconPsychology size={14} />
                        </ThemeIcon>
                        <Text size="sm" fw={500}>Psychological Flow</Text>
                      </Group>
                      <Text size="sm" c="dimmed">
                        {selectedTypeDetails.psychology}
                      </Text>
                    </Box>

                    {/* Content Structure */}
                    <Box>
                      <Group gap="xs" mb="xs">
                        <ThemeIcon size="sm" variant="light" color="blue">
                          <IconEducation size={14} />
                        </ThemeIcon>
                        <Text size="sm" fw={500}>Content Structure</Text>
                      </Group>
                      <List size="sm" spacing="xs">
                        {selectedTypeDetails.structure.map((item, idx) => (
                          <List.Item key={idx}>
                            <Text size="sm">{item}</Text>
                          </List.Item>
                        ))}
                      </List>
                    </Box>

                    {/* Example Headlines */}
                    <Box>
                      <Group gap="xs" mb="xs">
                        <ThemeIcon size="sm" variant="light" color="green">
                          <IconBulb size={14} />
                        </ThemeIcon>
                        <Text size="sm" fw={500}>Example Headlines</Text>
                      </Group>
                      <Stack gap="xs">
                        {selectedTypeDetails.examples.map((example, idx) => (
                          <Paper key={idx} p="xs" withBorder>
                            <Text size="sm" style={{ fontStyle: 'italic' }}>
                              "{example}"
                            </Text>
                          </Paper>
                        ))}
                      </Stack>
                    </Box>

                    {/* Best Platforms */}
                    <Box>
                      <Group gap="xs" mb="xs">
                        <ThemeIcon size="sm" variant="light" color="indigo">
                          <IconTrending size={14} />
                        </ThemeIcon>
                        <Text size="sm" fw={500}>Best Platforms</Text>
                      </Group>
                      <Group gap="xs">
                        {selectedTypeDetails.bestPlatforms.map((platform, idx) => (
                          <Badge 
                            key={idx} 
                            variant="outline" 
                            color="indigo"
                            size="sm"
                          >
                            {platform}
                          </Badge>
                        ))}
                      </Group>
                    </Box>

                    {/* Success Metrics */}
                    <Box>
                      <Group gap="xs" mb="xs">
                        <ThemeIcon size="sm" variant="light" color="teal">
                          <IconAnalytics size={14} />
                        </ThemeIcon>
                        <Text size="sm" fw={500}>Track These Metrics</Text>
                      </Group>
                      <SimpleGrid cols={2} spacing="xs">
                        {selectedTypeDetails.metrics.map((metric, idx) => (
                          <Text key={idx} size="xs" c="dimmed">
                            • {metric}
                          </Text>
                        ))}
                      </SimpleGrid>
                    </Box>

                    {/* What to Avoid */}
                    <Box>
                      <Group gap="xs" mb="xs">
                        <ThemeIcon size="sm" variant="light" color="red">
                          <IconWarning size={14} />
                        </ThemeIcon>
                        <Text size="sm" fw={500}>Common Mistakes</Text>
                      </Group>
                      <List size="sm" spacing="xs">
                        {selectedTypeDetails.avoid.map((item, idx) => (
                          <List.Item key={idx} icon={
                            <ThemeIcon size="xs" color="red" variant="light">
                              <IconWarning size={10} />
                            </ThemeIcon>
                          }>
                            <Text size="sm" c="dimmed">{item}</Text>
                          </List.Item>
                        ))}
                      </List>
                    </Box>

                    {/* Recommended CTAs */}
                    <Box>
                      <Group gap="xs" mb="xs">
                        <ThemeIcon size="sm" variant="light" color="grape">
                          <IconCheck size={14} />
                        </ThemeIcon>
                        <Text size="sm" fw={500}>Recommended CTAs</Text>
                      </Group>
                      <Group gap="xs">
                        {getRecommendedCTAs().map((cta, idx) => (
                          <Badge 
                            key={idx} 
                            variant="filled" 
                            color="grape"
                            size="sm"
                          >
                            {cta.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                      </Group>
                    </Box>
                </Stack>
              </Stack>
            </Card>

            {/* Content Strategy Tip */}
            <Alert
              icon={<IconInfo size={16} />}
              title="Content Strategy Tip"
              color="blue"
              variant="light"
            >
              <Stack gap="xs">
                <Text size="sm">
                  <strong>{selectedTypeDetails?.title}</strong> content works best when you {selectedTypeDetails?.approach?.toLowerCase()}.
                  Focus on {selectedTypeDetails?.psychologicalDriver?.toLowerCase()} to maximize impact.
                </Text>
                
                {/* Content Mix Recommendation */}
                <Box>
                  <Text size="xs" c="dimmed" mb={4}>
                    For a balanced content strategy, consider this weekly mix:
                  </Text>
                  <Group gap={4}>
                    {getContentMixRecommendation('balanced').distribution.map((item, idx) => (
                      <Tooltip key={idx} label={`${item.count} ${item.type} posts per week`}>
                        <Badge 
                          size="xs" 
                          variant="dot" 
                          color={getCopyTypeDetails(item.type)?.color}
                        >
                          {item.count}x {item.type}
                        </Badge>
                      </Tooltip>
                    ))}
                  </Group>
                </Box>
              </Stack>
            </Alert>

            {/* Platform Compatibility Notice */}
            {platform && (
              <Alert
                icon={<IconInfo size={16} />}
                color="violet"
                variant="light"
              >
                <Text size="sm">
                  <strong>Platform Tip:</strong> {selectedTypeDetails?.title} content on {platform.replace(/_/g, ' ').toLowerCase()} should focus on {selectedTypeDetails?.bestPlatforms.some(p => 
                    platform.toLowerCase().includes(p.toLowerCase().split(' ')[0])
                  ) ? 'leveraging the platform\'s strengths' : 'adapting to platform conventions'}.
                </Text>
              </Alert>
            )}
          </Stack>
        )}
      </Drawer>

      {/* Copy Type Selection Modal - Timeline Journey Design */}
      <Modal
        opened={copyTypeModalOpen}
        onClose={() => {}} // Disable default close behavior
        title={
          <Text size="lg" fw={600}>Customer Journey</Text>
        }
        size="md"
        centered
        withCloseButton={false}
        closeOnClickOutside={false}
        closeOnEscape={false}
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
          <Stack gap={0} style={{ position: 'relative' }}>
            {/* Vertical line connecting all dots */}
            <Box
              style={{
                position: 'absolute',
                left: 24,
                top: 20,
                bottom: 20,
                width: 2,
                background: 'linear-gradient(180deg, var(--mantine-color-blue-3) 0%, var(--mantine-color-violet-3) 50%, var(--mantine-color-orange-3) 100%)',
                zIndex: 0
              }}
            />
            
            {/* Sort by funnel stage order */}
            {Object.entries(COPY_TYPES)
              .sort(([keyA], [keyB]) => {
                // Define proper journey order
                const order = {
                  'AWARENESS': 0,      // Top of Funnel - First
                  'ENGAGEMENT': 2,     // Top of Funnel
                  'EDUCATION': 1,      // Middle of Funnel
                  'CONSIDERATION': 3,  // Middle of Funnel
                  'CONVERSION': 4,     // Bottom of Funnel
                  'RETENTION': 5       // Bottom of Funnel - Last
                };
                return order[keyA] - order[keyB];
              })
              .map(([key, val], index) => {
              const details = getCopyTypeDetails(key);
              const journey = getJourneyStage(key);
              const isSelected = localValue === val;
              
              // Get color based on position in funnel
              const getDotColor = (stage) => {
                if (stage?.includes('Top')) return 'blue';
                if (stage?.includes('Middle')) return 'violet';
                if (stage?.includes('Bottom')) return 'orange';
                return 'gray';
              };
              
              return (
                <UnstyledButton
                  key={key}
                  onClick={() => handleCopyTypeSelect(val)}
                  style={{ width: '100%', position: 'relative', zIndex: 1 }}
                >
                  <Group 
                    gap="md" 
                    wrap="nowrap"
                    py="md"
                    px="xs"
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      borderRadius: 8,
                      backgroundColor: isSelected ? 'var(--mantine-color-violet-0)' : 'transparent'
                    }}
                    sx={(theme) => ({
                      '&:hover': {
                        backgroundColor: isSelected 
                          ? theme.colors.violet[1]
                          : theme.colors.gray[0]
                      }
                    })}
                  >
                    {/* Timeline dot */}
                    <Box
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor: isSelected 
                          ? 'var(--mantine-color-violet-6)'
                          : 'white',
                        border: `3px solid var(--mantine-color-${getDotColor(details?.funnelStage)}-5)`,
                        flexShrink: 0,
                        transition: 'all 0.2s ease',
                        transform: isSelected ? 'scale(1.2)' : 'scale(1)'
                      }}
                    />
                    
                    {/* Content */}
                    <Box style={{ flex: 1 }}>
                      <Group justify="space-between" wrap="nowrap" mb={4}>
                        <Text size="sm" fw={isSelected ? 600 : 500}>
                          {details?.title}
                        </Text>
                        <Badge 
                          size="xs" 
                          variant="light" 
                          color={getDotColor(details?.funnelStage)}
                        >
                          {details?.funnelStage}
                        </Badge>
                      </Group>
                      
                      {/* Expandable description - shown when selected or hovered */}
                      <Box
                        style={{
                          maxHeight: isSelected ? 100 : 0,
                          overflow: 'hidden',
                          transition: 'max-height 0.3s ease',
                          opacity: isSelected ? 1 : 0
                        }}
                      >
                        <Text size="xs" c="dimmed" mt={4}>
                          {details?.purpose}
                        </Text>
                        {journey && (
                          <Text size="xs" c="violet" mt={4} fs="italic">
                            Customer mindset: "{journey.mindset}"
                          </Text>
                        )}
                      </Box>
                      
                      {/* Always visible short description */}
                      {!isSelected && (
                        <Text size="xs" c="dimmed">
                          {journey?.stage || details?.psychology?.split('.')[0]}
                        </Text>
                      )}
                    </Box>
                  </Group>
                </UnstyledButton>
              );
            })}
          </Stack>
          
          {/* Journey progress indicator */}
          <Box mt="xl" pt="md" style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
            <Text size="xs" c="dimmed" mb="xs">Journey Progress</Text>
            <Group gap="xs" style={{ fontSize: 10 }}>
              <Text span>🔵 Discovery</Text>
              <Text span>→</Text>
              <Text span>🟣 Evaluation</Text>
              <Text span>→</Text>
              <Text span>🟠 Decision</Text>
            </Group>
          </Box>
        </ScrollArea>
        
        {/* Footer with selected copy type and action buttons */}
        <Box 
          pt="md" 
          mt="md" 
          style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}
        >
          {localValue && (
            <Box mb="md">
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Selected: <Text span fw={500}>{getCopyTypeDetails(localValue)?.title}</Text>
                </Text>
                <Badge size="sm" variant="light" color="violet">
                  {getCopyTypeDetails(localValue)?.funnelStage}
                </Badge>
              </Group>
            </Box>
          )}
          
          <Group justify="flex-end">
            <Button 
              variant="subtle" 
              onClick={() => {
                setLocalValue(value); // Reset to original value
                setCopyTypeModalOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="filled" 
              color="violet"
              onClick={handleModalClose}
              disabled={!localValue}
            >
              Apply Selection
            </Button>
          </Group>
        </Box>
      </Modal>
    </>
  );
};

export default memo(CopyTypeSelector);