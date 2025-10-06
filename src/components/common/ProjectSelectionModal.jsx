import {Link} from "react-router-dom"
import {
  Modal,
  Stack,
  Text,
  Alert,
  Paper,
  Group,
  Box,
  Button,
  ThemeIcon
} from "@mantine/core"
import {MdCheck as IconCheck} from "react-icons/md"

const ProjectSelectionModal = ({
  opened,
  onClose,
  onSelect,
  projects = [],
  selectedProjectId = null,
  title = "Select a Project",
  description = "Please select a project to continue",
  noProjectsMessage = "You need to create a project first.",
  showCreateButton = true,
  createButtonText = "Create New Project",
  createButtonPath = "/projects/create",
  allowClose = true // Whether to allow closing without selection
}) => {
  const handleProjectSelect = (projectId) => {
    onSelect(projectId)
    onClose()
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      size="md"
      closeOnClickOutside={allowClose || !!selectedProjectId}
      closeOnEscape={allowClose || !!selectedProjectId}
      withCloseButton={allowClose || !!selectedProjectId}
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          {description}
        </Text>

        {projects.length === 0 ? (
          <Alert color="yellow" title="No Projects Found">
            {noProjectsMessage}
          </Alert>
        ) : (
          <Stack gap="xs">
            {projects.map((project) => (
              <Paper
                key={project.id || project._id}
                p="md"
                radius="md"
                withBorder
                style={{
                  cursor: "pointer",
                  transition: "all 0.2s",
                  borderColor:
                    (project.id || project._id) === selectedProjectId
                      ? "var(--mantine-color-violet-5)"
                      : undefined
                }}
                onClick={() => handleProjectSelect(project.id || project._id)}
                sx={(theme) => ({
                  "&:hover": {
                    backgroundColor: theme.colors.gray[0],
                    borderColor: theme.colors.violet[3]
                  }
                })}
              >
                <Group justify="space-between">
                  <Box>
                    <Text fw={500}>{project.name}</Text>
                    <Text size="sm" c="dimmed">
                      {project.location || "No description"}
                    </Text>
                  </Box>
                  {(project.id || project._id) === selectedProjectId && (
                    <ThemeIcon color="violet" variant="light" radius="xl">
                      <IconCheck size={16} />
                    </ThemeIcon>
                  )}
                </Group>
              </Paper>
            ))}
          </Stack>
        )}

        {showCreateButton && projects.length > 0 && (
          <Button
            component={Link}
            to={createButtonPath}
            variant="subtle"
            fullWidth
          >
            {createButtonText}
          </Button>
        )}
      </Stack>
    </Modal>
  )
}

export default ProjectSelectionModal
