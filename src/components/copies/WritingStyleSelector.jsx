import { useState, useEffect } from 'react';
import {
  Box,
  Stack,
  Group,
  Text,
  Badge,
  Button,
  Modal,
  Textarea,
  TagsInput,
  Card,
  ActionIcon,
  ThemeIcon,
  Loader,
  Center,
  Alert,
  ScrollArea,
  Tooltip,
  Divider,
  Chip
} from '@mantine/core';
import {
  MdAdd as IconAdd,
  MdEdit as IconEdit,
  MdDelete as IconDelete,
  MdCheck as IconCheck,
  MdClose as IconClose,
  MdStyle as IconStyle,
  MdAutoAwesome as IconMagic
} from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchWritingStyles,
  createWritingStyle,
  updateWritingStyle,
  deleteWritingStyle,
  selectWritingStyles,
  selectWritingStylesLoading,
  selectWritingStylesCreating,
  selectWritingStylesDeleting
} from '../../store/slices/writingStylesSlice';
import { useNotifications } from '../../hooks/useNotifications';

// Predefined tag suggestions
const TAG_SUGGESTIONS = [
  { value: 'professional', label: 'Professional', color: 'blue' },
  { value: 'casual', label: 'Casual', color: 'green' },
  { value: 'friendly', label: 'Friendly', color: 'yellow' },
  { value: 'formal', label: 'Formal', color: 'indigo' },
  { value: 'conversational', label: 'Conversational', color: 'teal' },
  { value: 'enthusiastic', label: 'Enthusiastic', color: 'orange' },
  { value: 'technical', label: 'Technical', color: 'gray' },
  { value: 'creative', label: 'Creative', color: 'pink' },
  { value: 'persuasive', label: 'Persuasive', color: 'violet' },
  { value: 'storytelling', label: 'Storytelling', color: 'grape' },
  { value: 'minimalist', label: 'Minimalist', color: 'dark' },
  { value: 'humorous', label: 'Humorous', color: 'lime' },
  { value: 'empathetic', label: 'Empathetic', color: 'cyan' },
  { value: 'authoritative', label: 'Authoritative', color: 'red' }
];

const WritingStyleSelector = ({ value, onChange, projectId }) => {
  const dispatch = useDispatch();
  const { toast } = useNotifications();
  
  const styles = useSelector(selectWritingStyles);
  const loading = useSelector(selectWritingStylesLoading);
  const creating = useSelector(selectWritingStylesCreating);
  const deleting = useSelector(selectWritingStylesDeleting);
  
  const [modalOpened, setModalOpened] = useState(false);
  const [editingStyle, setEditingStyle] = useState(null);
  const [showAllStyles, setShowAllStyles] = useState(false);
  const [loadedProjectId, setLoadedProjectId] = useState(null);
  
  // Form state
  const [sample, setSample] = useState('');
  const [tags, setTags] = useState([]);
  
  // Load writing styles when component mounts or projectId changes
  useEffect(() => {
    // Only fetch if projectId exists and is different from what we've already loaded
    if (projectId && projectId !== loadedProjectId) {
      dispatch(fetchWritingStyles({ projectId, limit: 20 }));
      setLoadedProjectId(projectId);
    }
  }, [projectId, loadedProjectId, dispatch]); // Include all dependencies
  
  const handleCreate = async () => {
    if (!sample.trim()) {
      toast('Please provide a writing sample', 'error');
      return;
    }
    
    if (tags.length === 0) {
      toast('Please select at least one tag', 'error');
      return;
    }
    
    try {
      const result = await dispatch(createWritingStyle({
        projectId,
        sample: sample.trim(),
        tags
      })).unwrap();
      
      toast('Writing style created successfully', 'success');
      setModalOpened(false);
      setSample('');
      setTags([]);
      
      // Auto-select the new style with its sample
      onChange(result._id, result.sample);
    } catch (error) {
      toast(error || 'Failed to create writing style', 'error');
    }
  };
  
  const handleUpdate = async () => {
    if (!editingStyle) return;
    
    if (!sample.trim()) {
      toast('Please provide a writing sample', 'error');
      return;
    }
    
    if (tags.length === 0) {
      toast('Please select at least one tag', 'error');
      return;
    }
    
    try {
      const result = await dispatch(updateWritingStyle({
        id: editingStyle._id,
        data: {
          sample: sample.trim(),
          tags
        }
      })).unwrap();
      
      toast('Writing style updated successfully', 'success');
      
      // If the updated style is currently selected, update the onChange with new sample
      if (value === editingStyle._id) {
        onChange(editingStyle._id, sample.trim());
      }
      
      setModalOpened(false);
      setEditingStyle(null);
      setSample('');
      setTags([]);
    } catch (error) {
      toast(error || 'Failed to update writing style', 'error');
    }
  };
  
  const handleDelete = async (styleId) => {
    if (window.confirm('Are you sure you want to delete this writing style?')) {
      try {
        await dispatch(deleteWritingStyle(styleId)).unwrap();
        toast('Writing style deleted successfully', 'success');
        
        // Clear selection if deleted style was selected
        if (value === styleId) {
          onChange('', '');
        }
      } catch (error) {
        toast(error || 'Failed to delete writing style', 'error');
      }
    }
  };
  
  const openEditModal = (style) => {
    setEditingStyle(style);
    setSample(style.sample);
    setTags(style.tags);
    setModalOpened(true);
  };
  
  const openCreateModal = () => {
    setEditingStyle(null);
    setSample('');
    setTags([]);
    setModalOpened(true);
  };
  
  const selectedStyle = styles.find(s => s._id === value);
  const displayedStyles = showAllStyles ? styles : styles.slice(0, 3);
  
  const getTagColor = (tag) => {
    const suggestion = TAG_SUGGESTIONS.find(s => s.value === tag);
    return suggestion?.color || 'gray';
  };
  
  return (
    <>
      <Box>
        <Group justify="space-between" mb="xs">
          <Group gap="xs">
            <ThemeIcon size="sm" variant="light" color="violet">
              <IconStyle size={14} />
            </ThemeIcon>
            <Text size="sm" fw={500}>Writing Style</Text>
            {selectedStyle && (
              <Badge size="sm" variant="dot" color="green">
                Selected
              </Badge>
            )}
          </Group>
          <Button
            size="xs"
            variant="subtle"
            leftSection={<IconAdd size={14} />}
            onClick={openCreateModal}
          >
            New Style
          </Button>
        </Group>
        
        {loading && !styles.length ? (
          <Center py="md">
            <Loader size="sm" />
          </Center>
        ) : styles.length === 0 ? (
          <Alert 
            color="yellow" 
            variant="light"
            icon={<IconMagic size={16} />}
          >
            <Group justify="space-between" align="center">
              <Text size="sm">
                No writing styles yet. Create one to maintain consistency in your content.
              </Text>
              <Button size="xs" variant="filled" color="yellow" onClick={openCreateModal}>
                Create First Style
              </Button>
            </Group>
          </Alert>
        ) : (
          <Stack gap="xs">
            <ScrollArea.Autosize mah={400}>
              <Stack gap="xs">
                {displayedStyles.map((style) => (
                  <Card
                    key={style._id}
                    p="sm"
                    withBorder
                    style={{
                      cursor: 'pointer',
                      borderColor: value === style._id ? 'var(--mantine-color-violet-5)' : undefined,
                      backgroundColor: value === style._id ? 'var(--mantine-color-violet-0)' : undefined,
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => onChange(style._id, style.sample)}
                  >
                    <Stack gap="xs">
                      <Group justify="space-between">
                        <Group gap="xs">
                          {value === style._id && (
                            <ThemeIcon size="sm" color="violet" variant="filled" radius="xl">
                              <IconCheck size={12} />
                            </ThemeIcon>
                          )}
                          <Group gap={4}>
                            {style.tags.map((tag) => (
                              <Badge
                                key={tag}
                                size="xs"
                                variant="light"
                                color={getTagColor(tag)}
                                style={{ textTransform: 'capitalize' }}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </Group>
                        </Group>
                        <Group gap={4}>
                          <Tooltip label="Edit style">
                            <ActionIcon
                              size="sm"
                              variant="subtle"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(style);
                              }}
                            >
                              <IconEdit size={14} />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label="Delete style">
                            <ActionIcon
                              size="sm"
                              variant="subtle"
                              color="red"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(style._id);
                              }}
                              loading={deleting}
                            >
                              <IconDelete size={14} />
                            </ActionIcon>
                          </Tooltip>
                        </Group>
                      </Group>
                      
                      <Text 
                        size="sm" 
                        c="dimmed" 
                        style={{ 
                          marginTop: 8,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          lineHeight: '1.4'
                        }}
                        title={style.sample}
                      >
                        {style.sample}
                      </Text>
                    </Stack>
                  </Card>
                ))}
              </Stack>
            </ScrollArea.Autosize>
            
            {styles.length > 3 && (
              <Center>
                <Button
                  size="xs"
                  variant="subtle"
                  onClick={() => setShowAllStyles(!showAllStyles)}
                >
                  {showAllStyles ? 'Show less' : `Show ${styles.length - 3} more`}
                </Button>
              </Center>
            )}
          </Stack>
        )}
        
        {selectedStyle && (
          <Box mt="xs" p="xs" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
            <Text size="xs" c="dimmed">
              Selected: {selectedStyle.tags.join(', ')}
            </Text>
          </Box>
        )}
      </Box>
      
      {/* Create/Edit Modal */}
      <Modal
        opened={modalOpened}
        onClose={() => {
          setModalOpened(false);
          setEditingStyle(null);
        }}
        title={
          <Group gap="xs">
            <ThemeIcon size="md" variant="light" color="violet">
              <IconStyle size={16} />
            </ThemeIcon>
            <Text fw={600}>
              {editingStyle ? 'Edit Writing Style' : 'Create Writing Style'}
            </Text>
          </Group>
        }
        size="lg"
        centered
      >
        <Stack gap="md">
          <Box>
            <TagsInput
              label={
                <Group gap="xs">
                  <Text>Style Tags</Text>
                  <Badge size="xs" variant="filled" color="violet">
                    {tags.length}/5
                  </Badge>
                </Group>
              }
              description="Type and press Enter to add custom tags, or select from suggestions below"
              placeholder={tags.length === 0 ? "Enter tags (e.g., professional, friendly, casual)" : tags.length >= 5 ? "Maximum tags reached" : "Add more tags..."}
              value={tags}
              onChange={(value) => {
                // Limit to 5 tags
                if (value.length <= 5) {
                  setTags(value);
                }
              }}
              required
              clearable
              maxTags={5}
              splitChars={[',', ';']}
              acceptValueOnBlur
              allowDuplicates={false}
              data={TAG_SUGGESTIONS.map(t => ({
                value: t.value,
                label: t.label
              }))}
              renderOption={({ option }) => (
                <Group gap="xs">
                  <Badge size="xs" variant="light" color={TAG_SUGGESTIONS.find(t => t.value === option.value)?.color || 'gray'}>
                    {option.label}
                  </Badge>
                </Group>
              )}
              styles={{
                input: {
                  minHeight: '42px'
                },
                pill: {
                  backgroundColor: 'var(--mantine-color-violet-1)',
                  color: 'var(--mantine-color-violet-7)',
                  fontWeight: 500,
                  textTransform: 'lowercase'
                },
                dropdown: {
                  maxHeight: 200
                }
              }}
              error={tags.length === 0 ? 'Please add at least one tag' : null}
            />
            
            {/* Quick tag selection chips */}
            <Box mt="xs">
              <Text size="xs" c="dimmed" mb={8}>
                Quick select:
              </Text>
              <Group gap={6}>
                {TAG_SUGGESTIONS.filter(suggestion => !tags.includes(suggestion.value))
                  .slice(0, 8)
                  .map((suggestion) => (
                    <Chip
                      key={suggestion.value}
                      size="xs"
                      variant="outline"
                      color={suggestion.color}
                      checked={false}
                      onClick={() => {
                        if (tags.length < 5) {
                          setTags([...tags, suggestion.value]);
                        }
                      }}
                      styles={{
                        label: {
                          cursor: 'pointer',
                          padding: '4px 10px',
                          fontSize: '11px',
                          textTransform: 'capitalize'
                        }
                      }}
                    >
                      {suggestion.label}
                    </Chip>
                  ))}
              </Group>
              {tags.length >= 5 && (
                <Text size="xs" c="yellow" mt={8}>
                  Maximum 5 tags allowed
                </Text>
              )}
            </Box>
          </Box>
          
          <Textarea
            label="Writing Sample"
            description="Provide a sample text that represents this writing style"
            placeholder="E.g., Hey everyone! 🚀 Super excited to share this incredible breakthrough in AI technology that's going to revolutionize how we work..."
            value={sample}
            onChange={(e) => setSample(e.target.value)}
            required
            minRows={4}
            maxRows={8}
            maxLength={2000}
            error={sample.length > 1900 ? 'Sample is too long' : null}
          />
          
          <Text size="xs" c="dimmed" ta="right">
            {sample.length}/2000 characters
          </Text>
          
          <Divider />
          
          <Group justify="flex-end">
            <Button
              variant="default"
              onClick={() => {
                setModalOpened(false);
                setEditingStyle(null);
              }}
            >
              Cancel
            </Button>
            <Button
              leftSection={editingStyle ? <IconEdit size={16} /> : <IconAdd size={16} />}
              onClick={editingStyle ? handleUpdate : handleCreate}
              loading={creating}
              variant="gradient"
              gradient={{ from: 'violet', to: 'grape', deg: 135 }}
            >
              {editingStyle ? 'Update Style' : 'Create Style'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default WritingStyleSelector;