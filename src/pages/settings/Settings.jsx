import {useNavigate} from "react-router-dom"
import {
  Container,
  Paper,
  Title,
  Text,
  Group,
  Stack,
  Box,
  Grid,
  ThemeIcon,
  Card,
  UnstyledButton
} from "@mantine/core"
import {
  MdPerson as IconUser,
  MdCreditCard as IconCreditCard,
  MdArrowForward as IconArrowForward
} from "react-icons/md"
import {PageTransition} from "../../components/ui/AnimatedElements"
import SiteMetaTags from "../../components/SEO/SiteMetaTags"

const Settings = () => {
  const navigate = useNavigate()

  const settingsOptions = [
    {
      title: "Account",
      description: "Manage your personal information and preferences",
      icon: IconUser,
      color: "blue",
      path: "/settings/account"
    },
    {
      title: "Billing",
      description: "Manage your subscription and payment methods",
      icon: IconCreditCard,
      color: "violet",
      path: "/settings/billing"
    }
  ]

  return (
    <PageTransition>
      <SiteMetaTags
        title="Settings"
        description="Manage your BrandBanda account settings, preferences, and subscription"
        keywords="account settings, preferences, subscription management, BrandBanda settings"
        canonicalUrl="https://www.brandbanda.com/settings"
      />
      <Stack size="lg">
        {/* <Group justify="space-between" mb="xl">
          <Box>
            <Title order={2}>Settings</Title>
            <Text c="dimmed" size="sm">
              Manage your account settings and preferences
            </Text>
          </Box>
        </Group> */}

        <Grid gutter="md">
          {settingsOptions.map((option) => (
            <Grid.Col key={option.path} span={{base: 12, sm: 6}}>
              <UnstyledButton
                onClick={() => navigate(option.path)}
                style={{width: "100%"}}
              >
                <Card
                  shadow="sm"
                  radius="md"
                  withBorder
                  p="xl"
                  style={{
                    transition: "all 0.2s ease",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)"
                    e.currentTarget.style.boxShadow =
                      "0 8px 30px rgba(0,0,0,0.12)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = ""
                  }}
                >
                  <Group justify="space-between" align="flex-start">
                    <Box style={{flex: 1}}>
                      <Group mb="xs">
                        <ThemeIcon size="lg" radius="md" color={option.color}>
                          <option.icon size={20} />
                        </ThemeIcon>
                        <Text size="lg" fw={600}>
                          {option.title}
                        </Text>
                      </Group>
                      <Text size="sm" c="dimmed">
                        {option.description}
                      </Text>
                    </Box>
                    <ThemeIcon
                      size="lg"
                      radius="md"
                      variant="light"
                      color="gray"
                    >
                      <IconArrowForward size={20} />
                    </ThemeIcon>
                  </Group>
                </Card>
              </UnstyledButton>
            </Grid.Col>
          ))}
        </Grid>
      </Stack>
    </PageTransition>
  )
}

export default Settings
