import { useState, useEffect } from 'react';
import {
  Box,
  Stack,
  Group,
  Text,
  Badge,
  Select,
  Card,
  ThemeIcon,
  Tooltip,
  Alert,
  Drawer,
  SimpleGrid,
  List,
  Divider,
  Paper,
  ActionIcon,
  ScrollArea
} from '@mantine/core';
import {
  MdInfo as IconInfo,
  MdLightbulb as IconBulb,
  MdWarning as IconWarning,
  MdCheck as IconCheck,
  MdAutoAwesome as IconSparkle
} from 'react-icons/md';
import { 
  CALL_TO_ACTION_TYPES,
  getCTACompatibility,
  getCTAInstructions,
  getPlatformCTAFormat,
  formatPlatformName
} from '../../services/copyService';

const CTASelector = ({ 
  value, 
  onChange, 
  copyType, 
  platform
}) => {
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [selectedCTAInfo, setSelectedCTAInfo] = useState(null);
  const [recommendedCTAs, setRecommendedCTAs] = useState([]);

  // Get recommended CTAs based on copy type
  useEffect(() => {
    if (copyType) {
      const recommended = getCTACompatibility(copyType);
      setRecommendedCTAs(recommended);
    }
  }, [copyType]);

  // Get CTA information when selected
  useEffect(() => {
    if (value) {
      const info = getCTAInstructions(value);
      setSelectedCTAInfo(info);
    }
  }, [value]);

  // Format CTA options with recommendations
  const formatCTAOptions = () => {
    if (!copyType || recommendedCTAs.length === 0) {
      // Return flat array if no copy type selected
      return Object.entries(CALL_TO_ACTION_TYPES).map(([key, val]) => ({
        value: val,
        label: val.replace(/_/g, ' ').toLowerCase()
          .replace(/\b\w/g, c => c.toUpperCase())
      }));
    }
    
    // Group options when copy type is selected
    const recommended = [];
    const others = [];
    
    Object.entries(CALL_TO_ACTION_TYPES).forEach(([key, val]) => {
      const option = {
        value: val,
        label: val.replace(/_/g, ' ').toLowerCase()
          .replace(/\b\w/g, c => c.toUpperCase())
      };
      
      if (recommendedCTAs.includes(key)) {
        recommended.push(option);
      } else {
        others.push(option);
      }
    });
    
    return [
      {
        group: 'Recommended for this copy type',
        items: recommended
      },
      {
        group: 'Other options',
        items: others
      }
    ];
  };

  // Get urgency badge color
  const getUrgencyColor = (urgency) => {
    switch(urgency) {
      case 'HIGH': return 'red';
      case 'MEDIUM': return 'orange';
      case 'LOW': return 'green';
      default: return 'gray';
    }
  };

  return (
    <>
      <Stack gap="md">
        {/* CTA Selection */}
        <Box>
          <Group justify="space-between" mb="xs">
            <Text size="sm" fw={500}>Call to Action Type</Text>
            {value && (
              <Group gap={4}>
                <Badge size="xs" variant="dot" color="violet">
                  {selectedCTAInfo?.urgency} Urgency
                </Badge>
                <Tooltip label="View CTA guide and best practices">
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
        
        <Select
          value={value}
          onChange={onChange}
          placeholder="Choose the type of action you want users to take"
          data={formatCTAOptions()}
          required
          description={
            copyType ? 
            `Based on your ${copyType.toLowerCase()} copy type, we've highlighted the most effective CTAs` :
            'Select a copy type above to see recommendations'
          }
          />
        </Box>
      </Stack>

      {/* Details Drawer */}
      <Drawer
        opened={detailsDrawerOpen}
        onClose={() => setDetailsDrawerOpen(false)}
        title={
          <Group gap="xs">
            <Text size="lg" fw={600}>
              {selectedCTAInfo?.icon} {value?.replace(/_/g, ' ')} Guide
            </Text>
            <Badge size="sm" variant="filled" color={getUrgencyColor(selectedCTAInfo?.urgency)}>
              {selectedCTAInfo?.urgency} Urgency
            </Badge>
          </Group>
        }
        size="lg"
        position="right"
        scrollAreaComponent={ScrollArea.Autosize}
      >
        {selectedCTAInfo && (
          <Stack gap="lg">
            {/* CTA Guidance Panel */}
            <Card withBorder radius="md" p="md">
              <Stack gap="sm">
                {/* Quick Info */}
                <Box>
                  <Text size="sm" c="dimmed" mb={4}>Approach:</Text>
                  <Text size="sm" fw={500}>{selectedCTAInfo.approach}</Text>
                </Box>

                <Stack gap="md" pt="sm">
                  <Divider />
                  
                  {/* Psychology */}
                  <Box>
                    <Group gap="xs" mb="xs">
                      <ThemeIcon size="sm" variant="light" color="blue">
                        <IconBulb size={14} />
                      </ThemeIcon>
                      <Text size="sm" fw={500}>Psychology</Text>
                    </Group>
                    <Text size="sm" c="dimmed">
                      {selectedCTAInfo.psychology}
                    </Text>
                  </Box>

                  {/* Examples */}
                  <Box>
                    <Group gap="xs" mb="xs">
                      <ThemeIcon size="sm" variant="light" color="green">
                        <IconCheck size={14} />
                      </ThemeIcon>
                      <Text size="sm" fw={500}>Example CTAs</Text>
                    </Group>
                    <Group gap="xs">
                      {selectedCTAInfo.examples.map((example, idx) => (
                        <Badge 
                          key={idx} 
                          variant="outline" 
                          color={selectedCTAInfo.color}
                          size="sm"
                        >
                          {example}
                        </Badge>
                      ))}
                    </Group>
                  </Box>

                  {/* What to Avoid */}
                  <Box>
                    <Group gap="xs" mb="xs">
                      <ThemeIcon size="sm" variant="light" color="red">
                        <IconWarning size={14} />
                      </ThemeIcon>
                      <Text size="sm" fw={500}>Avoid</Text>
                    </Group>
                    <Text size="sm" c="dimmed">
                      {selectedCTAInfo.avoid}
                    </Text>
                  </Box>
                </Stack>
              </Stack>
            </Card>

            {/* Platform-Specific CTA Tips */}
            {platform && (
              <Alert
                icon={<IconInfo size={16} />}
                title={`${formatPlatformName(platform)} CTA Tips`}
                color="violet"
                variant="light"
              >
                <Stack gap="xs">
                  {(() => {
                    const platformFormat = getPlatformCTAFormat(platform, value);
                    return (
                      <>
                        <Text size="sm" fw={500}>
                          {platformFormat.format}
                        </Text>
                        {platformFormat.example && (
                          <Paper p="xs" withBorder>
                            <Text size="xs" c="dimmed" mb={4}>Example:</Text>
                            <Text size="sm" style={{ fontStyle: 'italic' }}>
                              "{platformFormat.example}"
                            </Text>
                          </Paper>
                        )}
                        {platformFormat.tips && (
                          <Box>
                            <Text size="xs" c="dimmed" mb={4}>Best Practices:</Text>
                            <List size="sm" spacing="xs">
                              {platformFormat.tips.map((tip, idx) => (
                                <List.Item key={idx}>
                                  <Text size="sm">{tip}</Text>
                                </List.Item>
                              ))}
                            </List>
                          </Box>
                        )}
                      </>
                    );
                  })()}
                </Stack>
              </Alert>
            )}

            {/* Compatibility Notice */}
            {copyType && !recommendedCTAs.includes(value) && (
              <Alert
                icon={<IconInfo size={16} />}
                color="yellow"
                variant="light"
              >
                <Text size="sm">
                  This CTA type isn't typically recommended for {copyType.toLowerCase()} content, 
                  but can still be effective with the right messaging. Consider the recommended options 
                  for best results.
                </Text>
              </Alert>
            )}
          </Stack>
        )}
      </Drawer>
    </>
  );
};

export default CTASelector;