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
import {MdSettings} from "react-icons/md"
import manifestsService from "../../services/manifests"
import webscraperService from "../../services/webscraper"

const FlowActionManagement = () => {
  const [loading, setLoading] = useState({
    item: false,
    keyword: false,
    keywordPage: false,
    store: false,
    scrapItem: false,
    scrapKeyword: false,
    scrapKeywordPage: false,
    scrapStore: false,
    handleScraped: false
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

  // Handle manifest to scrap
  const handleManifestToScrap = async (type, loadingKey) => {
    setLoading((prev) => ({...prev, [loadingKey]: true}))

    try {
      const response = await manifestsService.sendManifestToScrap({
        type,
        status: "PENDING"
      })

      notifications.show({
        title: "Success",
        message: `${
          type.charAt(0).toUpperCase() + type.slice(1)
        } manifest sent to scraping`,
        color: "green",
        icon: <HiPlay />
      })
    } catch (error) {
      notifications.show({
        title: "Error",
        message: error.message || `Failed to send ${type} manifest to scrap`,
        color: "red"
      })
    } finally {
      setLoading((prev) => ({...prev, [loadingKey]: false}))
    }
  }

  // Handle scraped data processing
  const handleScrapedData = async () => {
    setLoading((prev) => ({...prev, handleScraped: true}))

    try {
      const response = await webscraperService.handleScraped()

      notifications.show({
        title: "Success",
        message: response.message || `Processing completed. Processed: ${response.processed || 0}`,
        color: "green",
        icon: <MdSettings />
      })
    } catch (error) {
      notifications.show({
        title: "Error",
        message: error.message || "Failed to handle scraped data",
        color: "red"
      })
    } finally {
      setLoading((prev) => ({...prev, handleScraped: false}))
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

                {/* Store Manifest Button */}
                <Button
                  leftSection={<HiPlay />}
                  color="orange"
                  size="md"
                  loading={loading.store}
                  onClick={() => handleGenerateManifest("store")}
                >
                  Generate Store Manifest
                </Button>
              </Group>
            </Stack>
          </Stack>
        </Paper>

        {/* Manifest to Scrap Section */}
        <Paper shadow="sm" p="lg" radius="md" withBorder>
          <Stack gap="md">
            {/* Section Header */}
            <Group justify="space-between" align="center">
              <div>
                <Title order={3}>Manifest to Scraping</Title>
                <Text size="sm" c="dimmed" mt={4}>
                  Send pending manifests to the scraping queue
                </Text>
              </div>
              <Tooltip
                label="This action sends pending manifests to the scraping queue for processing."
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
              title="Note"
              color="cyan"
              variant="light"
            >
              Send manifests with PENDING status to the scraping queue for processing.
            </Alert>

            <Divider />

            {/* Manifest to Scrap Buttons */}
            <Stack gap="sm">
              <Text size="sm" fw={500}>
                Select manifest type to send to scraping:
              </Text>

              <Group>
                {/* Keyword Manifest to Scrap */}
                <Button
                  leftSection={<HiPlay />}
                  color="teal"
                  size="md"
                  loading={loading.scrapKeyword}
                  onClick={() => handleManifestToScrap("keyword", "scrapKeyword")}
                >
                  Send Keyword to Scrap
                </Button>

                {/* Keyword Page Manifest to Scrap */}
                <Button
                  leftSection={<HiPlay />}
                  color="violet"
                  size="md"
                  loading={loading.scrapKeywordPage}
                  onClick={() =>
                    handleManifestToScrap("keywordPage", "scrapKeywordPage")
                  }
                >
                  Send Keyword Page to Scrap
                </Button>

                {/* Item Manifest to Scrap */}
                <Button
                  leftSection={<HiPlay />}
                  color="indigo"
                  size="md"
                  loading={loading.scrapItem}
                  onClick={() => handleManifestToScrap("item", "scrapItem")}
                >
                  Send Item to Scrap
                </Button>

                {/* Store Manifest to Scrap */}
                <Button
                  leftSection={<HiPlay />}
                  color="orange"
                  size="md"
                  loading={loading.scrapStore}
                  onClick={() => handleManifestToScrap("store", "scrapStore")}
                >
                  Send Store to Scrap
                </Button>
              </Group>
            </Stack>
          </Stack>
        </Paper>

        {/* Handle Scraped Data Section */}
        <Paper shadow="sm" p="lg" radius="md" withBorder>
          <Stack gap="md">
            {/* Section Header */}
            <Group justify="space-between" align="center">
              <div>
                <Title order={3}>Handle Scraped Data</Title>
                <Text size="sm" c="dimmed" mt={4}>
                  Process and handle completed scraping results
                </Text>
              </div>
              <Tooltip
                label="This processes all scraped data and updates the system accordingly."
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
              title="Processing"
              color="orange"
              variant="light"
            >
              Click the button below to process all completed scraping jobs and update the database.
            </Alert>

            <Divider />

            {/* Handle Scraped Button */}
            <Stack gap="sm">
              <Button
                leftSection={<MdSettings />}
                color="orange"
                size="lg"
                loading={loading.handleScraped}
                onClick={handleScrapedData}
              >
                Process Scraped Data
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  )
}

export default FlowActionManagement
