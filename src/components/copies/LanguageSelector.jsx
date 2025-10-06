import { useState, useEffect, useCallback, memo } from 'react';
import {
  Box,
  Stack,
  Group,
  Text,
  Badge,
  Modal,
  Paper,
  UnstyledButton,
  Button,
  ScrollArea,
  TextInput
} from '@mantine/core';
import {
  MdEdit as IconEdit,
  MdLanguage as IconLanguage,
  MdCheck as IconCheck,
  MdSearch as IconSearch
} from 'react-icons/md';

// Language to flag emoji mapping
const LANGUAGE_FLAGS = {
  ENGLISH: '🇬🇧',
  SPANISH: '🇪🇸',
  FRENCH: '🇫🇷',
  GERMAN: '🇩🇪',
  ITALIAN: '🇮🇹',
  PORTUGUESE: '🇵🇹',
  DUTCH: '🇳🇱',
  POLISH: '🇵🇱',
  RUSSIAN: '🇷🇺',
  JAPANESE: '🇯🇵',
  KOREAN: '🇰🇷',
  CHINESE: '🇨🇳',
  ARABIC: '🇸🇦',
  HINDI: '🇮🇳',
  TURKISH: '🇹🇷',
  SWEDISH: '🇸🇪',
  NORWEGIAN: '🇳🇴',
  DANISH: '🇩🇰',
  FINNISH: '🇫🇮',
  GREEK: '🇬🇷',
  HEBREW: '🇮🇱',
  THAI: '🇹🇭',
  VIETNAMESE: '🇻🇳',
  INDONESIAN: '🇮🇩',
  MALAY: '🇲🇾',
  FILIPINO: '🇵🇭',
  CZECH: '🇨🇿',
  SLOVAK: '🇸🇰',
  ROMANIAN: '🇷🇴',
  HUNGARIAN: '🇭🇺',
  BULGARIAN: '🇧🇬',
  CROATIAN: '🇭🇷',
  SERBIAN: '🇷🇸',
  UKRAINIAN: '🇺🇦',
  LITHUANIAN: '🇱🇹',
  LATVIAN: '🇱🇻',
  ESTONIAN: '🇪🇪',
  SLOVENIAN: '🇸🇮',
  ICELANDIC: '🇮🇸',
  IRISH: '🇮🇪',
  WELSH: '🏴󐁧󐁢󐁷󐁬󐁳󐁿',
  BASQUE: '🇪🇸',
  CATALAN: '🇪🇸',
  // Nordic additions
  FAROESE: '🇫🇴',
  GREENLANDIC: '🇬🇱',
  SAMI: '🇳🇴',
  // Eastern European additions
  ALBANIAN: '🇦🇱',
  MACEDONIAN: '🇲🇰',
  BOSNIAN: '🇧🇦',
  MONTENEGRIN: '🇲🇪',
  BELARUSIAN: '🇧🇾',
  MOLDOVAN: '🇲🇩',
  // Other additions
  MALTESE: '🇲🇹',
  LUXEMBOURGISH: '🇱🇺',
  GALICIAN: '🇪🇸',
  SCOTS_GAELIC: '🏴󐁧󐁢󐁳󐁣󐁴󐁿',
  BRETON: '🇫🇷',
  CORSICAN: '🇫🇷',
  ESPERANTO: '🌍',
  LATIN: '🇻🇦'
};

// Get all available languages from the service
import { LANGUAGES } from '../../services/copyService';

const LanguageSelector = ({ value, onChange }) => {
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const [searchValue, setSearchValue] = useState('');

  // Sync local value with prop value
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Handle language selection
  const handleLanguageSelect = useCallback((language) => {
    setLocalValue(language);
  }, []);

  // Handle modal close - apply selection
  const handleModalClose = useCallback(() => {
    if (localValue && localValue !== value) {
      onChange(localValue);
    }
    setLanguageModalOpen(false);
  }, [localValue, value, onChange]);

  // Format language name
  const formatLanguageName = (lang) => {
    // Handle special cases with underscores
    if (lang.includes('_')) {
      return lang.split('_')
        .map(word => word.charAt(0) + word.slice(1).toLowerCase())
        .join(' ');
    }
    return lang.charAt(0) + lang.slice(1).toLowerCase();
  };

  // Group languages by region
  const allGroupedLanguages = {
    'European': ['ENGLISH', 'SPANISH', 'FRENCH', 'GERMAN', 'ITALIAN', 'PORTUGUESE', 'DUTCH', 'POLISH', 'RUSSIAN'],
    'Asian': ['JAPANESE', 'KOREAN', 'CHINESE', 'HINDI', 'THAI', 'VIETNAMESE', 'INDONESIAN', 'MALAY', 'FILIPINO'],
    'Middle Eastern': ['ARABIC', 'HEBREW', 'TURKISH'],
    'Nordic': ['SWEDISH', 'NORWEGIAN', 'DANISH', 'FINNISH', 'ICELANDIC', 'FAROESE', 'GREENLANDIC', 'SAMI'],
    'Eastern European': ['CZECH', 'SLOVAK', 'ROMANIAN', 'HUNGARIAN', 'BULGARIAN', 'CROATIAN', 'SERBIAN', 'UKRAINIAN', 'LITHUANIAN', 'LATVIAN', 'ESTONIAN', 'SLOVENIAN', 'ALBANIAN', 'MACEDONIAN', 'BOSNIAN', 'MONTENEGRIN', 'BELARUSIAN', 'MOLDOVAN'],
    'Other': ['GREEK', 'IRISH', 'WELSH', 'BASQUE', 'CATALAN', 'MALTESE', 'LUXEMBOURGISH', 'GALICIAN', 'SCOTS_GAELIC', 'BRETON', 'CORSICAN', 'ESPERANTO', 'LATIN']
  };

  // Filter languages based on search
  const getFilteredLanguages = () => {
    if (!searchValue.trim()) {
      return allGroupedLanguages;
    }

    const search = searchValue.toLowerCase();
    const filtered = {};

    Object.entries(allGroupedLanguages).forEach(([region, languages]) => {
      const matchingLanguages = languages.filter(lang => {
        // Format language name inline to avoid dependency issues
        let langName;
        if (lang.includes('_')) {
          langName = lang.split('_')
            .map(word => word.charAt(0) + word.slice(1).toLowerCase())
            .join(' ').toLowerCase();
        } else {
          langName = (lang.charAt(0) + lang.slice(1).toLowerCase()).toLowerCase();
        }
        return langName.includes(search);
      });

      if (matchingLanguages.length > 0) {
        filtered[region] = matchingLanguages;
      }
    });

    return filtered;
  };

  return (
    <>
      <Stack gap="md">
        {/* Language Selection */}
        <Box>
          <Group justify="space-between" mb="xs">
            <Text size="sm" fw={500}>Language</Text>
            {value && (
              <Badge size="xs" variant="dot" color="violet">
                {LANGUAGE_FLAGS[value]} {formatLanguageName(value)}
              </Badge>
            )}
          </Group>
          
          <UnstyledButton 
            onClick={() => {
              setLocalValue(value); // Sync local value with current value
              setSearchValue(''); // Clear search when opening
              setLanguageModalOpen(true);
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
                    <Text size="xs" c="dimmed" mb={2}>Selected Language</Text>
                    <Group gap="xs">
                      <Text size="lg">{LANGUAGE_FLAGS[value]}</Text>
                      <Text size="sm" fw={600}>
                        {formatLanguageName(value)}
                      </Text>
                    </Group>
                  </Box>
                  <IconEdit size={18} color="var(--mantine-color-gray-6)" />
                </Group>
              ) : (
                <Group justify="space-between">
                  <Box>
                    <Text size="sm" fw={500}>Select Language</Text>
                    <Text size="xs" c="dimmed" mt={2}>
                      Choose the language for your content
                    </Text>
                  </Box>
                  <IconLanguage size={20} color="var(--mantine-color-gray-6)" />
                </Group>
              )}
            </Paper>
          </UnstyledButton>
        </Box>
      </Stack>

      {/* Language Selection Modal */}
      <Modal
        opened={languageModalOpen}
        onClose={() => {}} // Disable default close behavior
        title={
          <Text size="lg" fw={600}>Choose Language</Text>
        }
        size="lg"
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
        {/* Search Input */}
        <TextInput
          placeholder="Search languages..."
          leftSection={<IconSearch size={16} />}
          value={searchValue}
          onChange={(event) => setSearchValue(event.currentTarget.value)}
          mt="md"
          mb="md"
          styles={{
            input: {
              '&:focus': {
                borderColor: 'var(--mantine-color-violet-6)'
              }
            }
          }}
        />
        
        <ScrollArea h={400} offsetScrollbars>
          <Stack gap={0}>
            {Object.keys(getFilteredLanguages()).length === 0 ? (
              <Box p="xl" ta="center">
                <Text c="dimmed" size="sm">
                  No languages found matching "{searchValue}"
                </Text>
              </Box>
            ) : (
              Object.entries(getFilteredLanguages()).map(([region, languages], index) => (
              <Box key={region}>
                {/* Region Header */}
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
                    {region}
                  </Text>
                </Box>
                
                {/* Language Chips */}
                <Box px="md" py="xs">
                  <Group gap={6}>
                    {languages
                      .filter(lang => LANGUAGES[lang]) // Only show available languages
                      .map(lang => (
                        <UnstyledButton
                          key={lang}
                          onClick={() => handleLanguageSelect(lang)}
                        >
                          <Paper
                            px="sm"
                            py={4}
                            radius="xl"
                            bg={localValue === lang ? "violet.6" : "white"}
                            style={{
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                              border: localValue === lang 
                                ? '1px solid var(--mantine-color-violet-6)' 
                                : '1px solid var(--mantine-color-gray-3)'
                            }}
                            sx={(theme) => ({
                              '&:hover': {
                                backgroundColor: localValue === lang 
                                  ? theme.colors.violet[7]
                                  : theme.colors.gray[0],
                                borderColor: localValue === lang 
                                  ? theme.colors.violet[7]
                                  : theme.colors.gray[4]
                              }
                            })}
                          >
                            <Group gap={4} wrap="nowrap">
                              <Text size="sm">{LANGUAGE_FLAGS[lang]}</Text>
                              {localValue === lang && (
                                <IconCheck size={12} color="white" />
                              )}
                              <Text 
                                size="xs" 
                                fw={localValue === lang ? 500 : 400}
                                c={localValue === lang ? "white" : "dark"}
                              >
                                {formatLanguageName(lang)}
                              </Text>
                            </Group>
                          </Paper>
                        </UnstyledButton>
                      ))}
                  </Group>
                </Box>
              </Box>
            ))
            )}
          </Stack>
        </ScrollArea>
        
        {/* Footer with selected language and action buttons */}
        <Box 
          pt="md" 
          mt="md" 
          style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}
        >
          {localValue && (
            <Box mb="md">
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Selected: <Text span fw={500}>{LANGUAGE_FLAGS[localValue]} {formatLanguageName(localValue)}</Text>
                </Text>
              </Group>
            </Box>
          )}
          
          <Group justify="flex-end">
            <Button 
              variant="subtle" 
              onClick={() => {
                setLocalValue(value); // Reset to original value
                setSearchValue(''); // Clear search
                setLanguageModalOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="filled" 
              color="violet"
              onClick={() => {
                handleModalClose();
                setSearchValue(''); // Clear search
              }}
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

export default memo(LanguageSelector);