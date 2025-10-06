import {
  Container,
  Paper,
  Text,
  Button,
  Group,
  Stack,
  Box,
  TextInput,
  Select,
  Grid,
  Divider
} from "@mantine/core"
import {useForm} from "@mantine/form"
import {notifications} from "@mantine/notifications"
import {
  MdPerson as IconUser,
  MdEmail as IconEmail,
  MdLocationOn as IconLocation,
  MdSave as IconSave,
  MdCheck as IconCheck
} from "react-icons/md"
import {useAuth} from "../../hooks/useAuth"
import {useLoading} from "../../contexts/LoadingContext"
import {PageTransition} from "../../components/ui/AnimatedElements"
import SiteMetaTags from "../../components/SEO/SiteMetaTags"

const countryList = [
  {value: "AF", label: "Afghanistan"},
  {value: "AL", label: "Albania"},
  {value: "DZ", label: "Algeria"},
  {value: "AD", label: "Andorra"},
  {value: "AO", label: "Angola"},
  {value: "AG", label: "Antigua and Barbuda"},
  {value: "AR", label: "Argentina"},
  {value: "AM", label: "Armenia"},
  {value: "AU", label: "Australia"},
  {value: "AT", label: "Austria"},
  {value: "AZ", label: "Azerbaijan"},
  {value: "BS", label: "Bahamas"},
  {value: "BH", label: "Bahrain"},
  {value: "BD", label: "Bangladesh"},
  {value: "BB", label: "Barbados"},
  {value: "BY", label: "Belarus"},
  {value: "BE", label: "Belgium"},
  {value: "BZ", label: "Belize"},
  {value: "BJ", label: "Benin"},
  {value: "BT", label: "Bhutan"},
  {value: "BO", label: "Bolivia"},
  {value: "BA", label: "Bosnia and Herzegovina"},
  {value: "BW", label: "Botswana"},
  {value: "BR", label: "Brazil"},
  {value: "BN", label: "Brunei"},
  {value: "BG", label: "Bulgaria"},
  {value: "BF", label: "Burkina Faso"},
  {value: "BI", label: "Burundi"},
  {value: "CV", label: "Cabo Verde"},
  {value: "KH", label: "Cambodia"},
  {value: "CM", label: "Cameroon"},
  {value: "CA", label: "Canada"},
  {value: "CF", label: "Central African Republic"},
  {value: "TD", label: "Chad"},
  {value: "CL", label: "Chile"},
  {value: "CN", label: "China"},
  {value: "CO", label: "Colombia"},
  {value: "KM", label: "Comoros"},
  {value: "CG", label: "Congo"},
  {value: "CR", label: "Costa Rica"},
  {value: "HR", label: "Croatia"},
  {value: "CU", label: "Cuba"},
  {value: "CY", label: "Cyprus"},
  {value: "CZ", label: "Czech Republic"},
  {value: "DK", label: "Denmark"},
  {value: "DJ", label: "Djibouti"},
  {value: "DM", label: "Dominica"},
  {value: "DO", label: "Dominican Republic"},
  {value: "EC", label: "Ecuador"},
  {value: "EG", label: "Egypt"},
  {value: "SV", label: "El Salvador"},
  {value: "GQ", label: "Equatorial Guinea"},
  {value: "ER", label: "Eritrea"},
  {value: "EE", label: "Estonia"},
  {value: "SZ", label: "Eswatini"},
  {value: "ET", label: "Ethiopia"},
  {value: "FJ", label: "Fiji"},
  {value: "FI", label: "Finland"},
  {value: "FR", label: "France"},
  {value: "GA", label: "Gabon"},
  {value: "GM", label: "Gambia"},
  {value: "GE", label: "Georgia"},
  {value: "DE", label: "Germany"},
  {value: "GH", label: "Ghana"},
  {value: "GR", label: "Greece"},
  {value: "GD", label: "Grenada"},
  {value: "GT", label: "Guatemala"},
  {value: "GN", label: "Guinea"},
  {value: "GW", label: "Guinea-Bissau"},
  {value: "GY", label: "Guyana"},
  {value: "HT", label: "Haiti"},
  {value: "HN", label: "Honduras"},
  {value: "HU", label: "Hungary"},
  {value: "IS", label: "Iceland"},
  {value: "IN", label: "India"},
  {value: "ID", label: "Indonesia"},
  {value: "IR", label: "Iran"},
  {value: "IQ", label: "Iraq"},
  {value: "IE", label: "Ireland"},
  {value: "IL", label: "Israel"},
  {value: "IT", label: "Italy"},
  {value: "JM", label: "Jamaica"},
  {value: "JP", label: "Japan"},
  {value: "JO", label: "Jordan"},
  {value: "KZ", label: "Kazakhstan"},
  {value: "KE", label: "Kenya"},
  {value: "KI", label: "Kiribati"},
  {value: "KP", label: "North Korea"},
  {value: "KR", label: "South Korea"},
  {value: "KW", label: "Kuwait"},
  {value: "KG", label: "Kyrgyzstan"},
  {value: "LA", label: "Laos"},
  {value: "LV", label: "Latvia"},
  {value: "LB", label: "Lebanon"},
  {value: "LS", label: "Lesotho"},
  {value: "LR", label: "Liberia"},
  {value: "LY", label: "Libya"},
  {value: "LI", label: "Liechtenstein"},
  {value: "LT", label: "Lithuania"},
  {value: "LU", label: "Luxembourg"},
  {value: "MG", label: "Madagascar"},
  {value: "MW", label: "Malawi"},
  {value: "MY", label: "Malaysia"},
  {value: "MV", label: "Maldives"},
  {value: "ML", label: "Mali"},
  {value: "MT", label: "Malta"},
  {value: "MH", label: "Marshall Islands"},
  {value: "MR", label: "Mauritania"},
  {value: "MU", label: "Mauritius"},
  {value: "MX", label: "Mexico"},
  {value: "FM", label: "Micronesia"},
  {value: "MD", label: "Moldova"},
  {value: "MC", label: "Monaco"},
  {value: "MN", label: "Mongolia"},
  {value: "ME", label: "Montenegro"},
  {value: "MA", label: "Morocco"},
  {value: "MZ", label: "Mozambique"},
  {value: "MM", label: "Myanmar"},
  {value: "NA", label: "Namibia"},
  {value: "NR", label: "Nauru"},
  {value: "NP", label: "Nepal"},
  {value: "NL", label: "Netherlands"},
  {value: "NZ", label: "New Zealand"},
  {value: "NI", label: "Nicaragua"},
  {value: "NE", label: "Niger"},
  {value: "NG", label: "Nigeria"},
  {value: "MK", label: "North Macedonia"},
  {value: "NO", label: "Norway"},
  {value: "OM", label: "Oman"},
  {value: "PK", label: "Pakistan"},
  {value: "PW", label: "Palau"},
  {value: "PS", label: "Palestine"},
  {value: "PA", label: "Panama"},
  {value: "PG", label: "Papua New Guinea"},
  {value: "PY", label: "Paraguay"},
  {value: "PE", label: "Peru"},
  {value: "PH", label: "Philippines"},
  {value: "PL", label: "Poland"},
  {value: "PT", label: "Portugal"},
  {value: "QA", label: "Qatar"},
  {value: "RO", label: "Romania"},
  {value: "RU", label: "Russia"},
  {value: "RW", label: "Rwanda"},
  {value: "KN", label: "Saint Kitts and Nevis"},
  {value: "LC", label: "Saint Lucia"},
  {value: "VC", label: "Saint Vincent and the Grenadines"},
  {value: "WS", label: "Samoa"},
  {value: "SM", label: "San Marino"},
  {value: "ST", label: "Sao Tome and Principe"},
  {value: "SA", label: "Saudi Arabia"},
  {value: "SN", label: "Senegal"},
  {value: "RS", label: "Serbia"},
  {value: "SC", label: "Seychelles"},
  {value: "SL", label: "Sierra Leone"},
  {value: "SG", label: "Singapore"},
  {value: "SK", label: "Slovakia"},
  {value: "SI", label: "Slovenia"},
  {value: "SB", label: "Solomon Islands"},
  {value: "SO", label: "Somalia"},
  {value: "ZA", label: "South Africa"},
  {value: "SS", label: "South Sudan"},
  {value: "ES", label: "Spain"},
  {value: "LK", label: "Sri Lanka"},
  {value: "SD", label: "Sudan"},
  {value: "SR", label: "Suriname"},
  {value: "SE", label: "Sweden"},
  {value: "CH", label: "Switzerland"},
  {value: "SY", label: "Syria"},
  {value: "TW", label: "Taiwan"},
  {value: "TJ", label: "Tajikistan"},
  {value: "TZ", label: "Tanzania"},
  {value: "TH", label: "Thailand"},
  {value: "TL", label: "Timor-Leste"},
  {value: "TG", label: "Togo"},
  {value: "TO", label: "Tonga"},
  {value: "TT", label: "Trinidad and Tobago"},
  {value: "TN", label: "Tunisia"},
  {value: "TR", label: "Turkey"},
  {value: "TM", label: "Turkmenistan"},
  {value: "TV", label: "Tuvalu"},
  {value: "UG", label: "Uganda"},
  {value: "UA", label: "Ukraine"},
  {value: "AE", label: "United Arab Emirates"},
  {value: "GB", label: "United Kingdom"},
  {value: "US", label: "United States"},
  {value: "UY", label: "Uruguay"},
  {value: "UZ", label: "Uzbekistan"},
  {value: "VU", label: "Vanuatu"},
  {value: "VA", label: "Vatican City"},
  {value: "VE", label: "Venezuela"},
  {value: "VN", label: "Vietnam"},
  {value: "YE", label: "Yemen"},
  {value: "ZM", label: "Zambia"},
  {value: "ZW", label: "Zimbabwe"}
].sort((a, b) => a.label.localeCompare(b.label))

const Account = () => {
  const {user, updateUserProfile} = useAuth()
  const {showLoading, hideLoading} = useLoading()

  // Find country code from country name if user has location saved
  const getLocationCode = (locationName) => {
    if (!locationName) return ""
    const country = countryList.find((c) => c.label === locationName)
    return country ? country.value : locationName
  }

  const form = useForm({
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      mobile: user?.mobile || "",
      company: user?.company || "",
      role: user?.role || "",
      bio: user?.bio || "",
      website: user?.website || "",
      location: getLocationCode(user?.location) || "",
      skills: user?.skills || [],
      socialLinks: user?.socialLinks || {},
      timezone: user?.timezone || "UTC"
    },

    validate: {
      firstName: (value) => (!value.trim() ? "First name is required" : null),
      lastName: (value) => (!value.trim() ? "Last name is required" : null),
      email: (value) =>
        !value.trim()
          ? "Email is required"
          : !/^\S+@\S+$/.test(value)
          ? "Invalid email"
          : null
    }
  })

  const handleSaveProfile = async (values) => {
    showLoading('profile', 'Updating profile...')
    try {
      // Find the full country name from the country code
      let locationName = values.location
      if (values.location) {
        const country = countryList.find((c) => c.value === values.location)
        if (country) {
          locationName = country.label
        }
      }

      // Prepare update data matching backend API
      const updateData = {
        firstName: values.firstName,
        lastName: values.lastName,
        location: locationName // Now saves full country name instead of code
      }

      // Remove undefined values
      Object.keys(updateData).forEach((key) => {
        if (updateData[key] === undefined || updateData[key] === "") {
          delete updateData[key]
        }
      })

      console.log("Updating profile with data:", updateData)
      await updateUserProfile(updateData)

      notifications.show({
        title: "Success",
        message: "Profile updated successfully",
        color: "green",
        icon: <IconCheck />
      })
    } catch (error) {
      console.error("Profile update error:", error)
      notifications.show({
        title: "Error",
        message: error.message || "Failed to update profile",
        color: "red"
      })
    } finally {
      hideLoading('profile')
    }
  }

  return (
    <PageTransition>
      <SiteMetaTags
        title="Account Settings"
        description="Manage your BrandBanda account information and profile settings"
        keywords="account settings, profile, user preferences, personal information"
        canonicalUrl="https://www.brandbanda.com/settings/account"
      />
      <Stack gap="xl">
        <Paper shadow="sm" radius="md" withBorder p="sm">
          <form onSubmit={form.onSubmit(handleSaveProfile)}>
            <Stack>
              <Box>
                <Text size="lg" fw={600} mb="md">
                  Profile Information
                </Text>

                <Grid>
                  <Grid.Col span={6}>
                    <TextInput
                      label="First Name"
                      placeholder="John"
                      required
                      leftSection={<IconUser size={18} />}
                      {...form.getInputProps("firstName")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Last Name"
                      placeholder="Doe"
                      required
                      {...form.getInputProps("lastName")}
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <TextInput
                      label="Email"
                      placeholder="john@example.com"
                      required
                      leftSection={<IconEmail size={18} />}
                      {...form.getInputProps("email")}
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Select
                      label="Country"
                      placeholder="Select your country"
                      searchable
                      nothingFoundMessage="No country found"
                      leftSection={<IconLocation size={18} />}
                      data={countryList}
                      {...form.getInputProps("location")}
                    />
                  </Grid.Col>
                </Grid>
              </Box>

              <Divider />

              <Group justify="flex-end">
                <Button variant="default" onClick={() => form.reset()}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  leftSection={<IconSave size={16} />}
                >
                  Save Changes
                </Button>
              </Group>
            </Stack>
          </form>
        </Paper>
      </Stack>
    </PageTransition>
  )
}

export default Account
