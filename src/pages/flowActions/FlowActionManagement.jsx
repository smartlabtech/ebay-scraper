import React, {useState} from "react"
import {
  Container,
  Title,
  Text,
  Paper,
  Stack,
  Group,
  Button,
  Tooltip,
  Alert,
  Divider
} from "@mantine/core"
import {notifications} from "@mantine/notifications"
import {HiInformationCircle, HiDocumentAdd, HiPlay} from "react-icons/hi"
import manifestsService from "../../services/manifests"

const FlowActionManagement = () => {
  const [loading, setLoading] = useState({
    item: false,
    keyword: false,
    keywordPage: false
  })

  // Handle manifest generation
  const handleGenerateManifest = async (type) => {
    setLoading((prev) => ({...prev, [type]: true}))

    try {
      const response = await manifestsService.createManifest({type})

      notifications.show({
        title: "Success",
        message: `${
          type.charAt(0).toUpperCase() + type.slice(1)
        } manifest generated successfully`,
        color: "green",
        icon: <HiDocumentAdd />
      })
    } catch (error) {
      notifications.show({
        title: "Error",
        message: error.message || `Failed to generate ${type} manifest`,
        color: "red"
      })
    } finally {
      setLoading((prev) => ({...prev, [type]: false}))
    }
  }

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <div>
          <Title order={2}>Flow Action Manual Management</Title>
          <Text c="dimmed" size="sm" mt="xs">
            Manage and execute workflow actions for the scraping process
          </Text>
        </div>

        {/* Manifest Generation Section */}
        <Paper shadow="sm" p="lg" radius="md" withBorder>
          <Stack gap="md">
            {/* Section Header */}
            <Group justify="space-between" align="center">
              <div>
                <Title order={3}>Manifest Generation</Title>
                <Text size="sm" c="dimmed" mt={4}>
                  Generate manifests to initiate scraping jobs
                </Text>
              </div>
              <Tooltip
                label="This is the starting point for the scraping flow. No manifest = No scraping jobs will be created."
                multiline
                w={300}
                withArrow
                position="left"
              >
                <HiInformationCircle
                  size={24}
                  style={{color: "var(--mantine-color-blue-6)", cursor: "help"}}
                />
              </Tooltip>
            </Group>

            <Alert
              icon={<HiInformationCircle />}
              title="Important"
              color="blue"
              variant="light"
            >
              Manifests must be generated before any scraping can begin. This is
              the first step in the workflow.
            </Alert>

            <Divider />

            {/* Manifest Generation Buttons */}
            <Stack gap="sm">
              <Text size="sm" fw={500}>
                Select manifest type to generate:
              </Text>

              <Group>
                {/* Keyword Manifest Button */}
                <Button
                  leftSection={<HiPlay />}
                  color="teal"
                  size="md"
                  loading={loading.keyword}
                  onClick={() => handleGenerateManifest("keyword")}
                >
                  Generate Keyword Manifest
                </Button>

                {/* Keyword Page Manifest Button */}
                <Button
                  leftSection={<HiPlay />}
                  color="violet"
                  size="md"
                  loading={loading.keywordPage}
                  onClick={() => handleGenerateManifest("keywordPage")}
                >
                  Generate Keyword Page Manifest
                </Button>

                {/* Item Manifest Button */}
                <Button
                  leftSection={<HiPlay />}
                  color="indigo"
                  size="md"
                  loading={loading.item}
                  onClick={() => handleGenerateManifest("item")}
                >
                  Generate Item Manifest
                </Button>
              </Group>
            </Stack>
          </Stack>
        </Paper>

        {/* Future sections can be added here */}
      </Stack>
    </Container>
  )
}

export default FlowActionManagement
