import {useEffect, useState} from "react"
import {useParams, useNavigate, useLocation} from "react-router-dom"
import {
  Title,
  Card,
  TextInput,
  Textarea,
  Stack,
  Group,
  Button,
  ActionIcon,
  Box,
  Skeleton,
  Text
} from "@mantine/core"
import {
  MdSave,
  MdCancel,
  MdAutoAwesome,
  MdAdd as IconAdd,
  MdDelete as IconDelete
} from "react-icons/md"
import {useProducts} from "../../hooks/useProducts"
import {useNotifications} from "../../hooks/useNotifications"

const ProductForm = () => {
  const {id} = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const isNew = !id || id === "new"
  const duplicateFrom = location.state?.duplicateFrom

  const {
    currentProduct,
    loading,
    loadProduct,
    createNewProduct,
    updateExistingProduct
  } = useProducts()
  const {toast} = useNotifications()

  const selectedProjectId = localStorage.getItem("selectedProjectId")
  const [painPoints, setPainPoints] = useState([""])
  const [benefits, setBenefits] = useState([""])

  const [formData, setFormData] = useState({
    product: "",
    shortName: "",
    problemYouSolve: "",
    targetAudience: "",
    uniqueValue: ""
  })

  useEffect(() => {
    // Load existing product if editing
    if (!isNew && id) {
      loadProduct(id).catch((error) => {
        console.error("Failed to load product:", error)
        toast("Product not found", "error")
        navigate("/products")
      })
    }
  }, [id, isNew, loadProduct, navigate, toast])

  useEffect(() => {
    // Populate form with existing product data when editing
    if (!isNew && currentProduct) {
      setFormData({
        product: currentProduct.product || "",
        shortName: currentProduct.shortName || "",
        problemYouSolve: currentProduct.problemYouSolve || "",
        targetAudience: currentProduct.targetAudience || "",
        uniqueValue: currentProduct.uniqueValue || ""
      })
      setPainPoints(
        currentProduct.painPoints?.length > 0 ? currentProduct.painPoints : [""]
      )
      setBenefits(
        currentProduct.benefits?.length > 0 ? currentProduct.benefits : [""]
      )
    }
    // Populate form with duplicate data
    else if (duplicateFrom) {
      setFormData({
        product: duplicateFrom.product || "",
        shortName: duplicateFrom.shortName + " (Copy)",
        problemYouSolve: duplicateFrom.problemYouSolve || "",
        targetAudience: duplicateFrom.targetAudience || "",
        uniqueValue: duplicateFrom.uniqueValue || ""
      })
      setPainPoints(
        duplicateFrom.painPoints?.length > 0 ? duplicateFrom.painPoints : [""]
      )
      setBenefits(
        duplicateFrom.benefits?.length > 0 ? duplicateFrom.benefits : [""]
      )
    }
  }, [currentProduct, isNew, duplicateFrom])

  const handleAddPainPoint = () => {
    setPainPoints([...painPoints, ""])
  }

  const handleRemovePainPoint = (index) => {
    setPainPoints(painPoints.filter((_, i) => i !== index))
  }

  const handlePainPointChange = (index, value) => {
    const updated = [...painPoints]
    updated[index] = value
    setPainPoints(updated)
  }

  const handleAddBenefit = () => {
    setBenefits([...benefits, ""])
  }

  const handleRemoveBenefit = (index) => {
    setBenefits(benefits.filter((_, i) => i !== index))
  }

  const handleBenefitChange = (index, value) => {
    const updated = [...benefits]
    updated[index] = value
    setBenefits(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedProjectId) {
      toast("Please select a project first", "error")
      return
    }

    try {
      if (isNew) {
        const productData = {
          projectId: selectedProjectId,
          product: formData.product,
          shortName: formData.shortName,
          problemYouSolve: formData.problemYouSolve,
          targetAudience: formData.targetAudience,
          uniqueValue: formData.uniqueValue
          // Note: painPoints and benefits are not accepted in POST requests
          // They can only be added via PATCH after creation
        }
        const result = await createNewProduct(productData)

        // If there are painPoints or benefits, update the product with them
        const filteredPainPoints = painPoints.filter((p) => p.trim())
        const filteredBenefits = benefits.filter((b) => b.trim())

        if (filteredPainPoints.length > 0 || filteredBenefits.length > 0) {
          await updateExistingProduct(result._id, {
            painPoints: filteredPainPoints,
            benefits: filteredBenefits
          })
        }

        navigate(`/products/${result._id}`)
      } else {
        // For updates, exclude projectId from the payload
        const updateData = {
          product: formData.product,
          shortName: formData.shortName,
          problemYouSolve: formData.problemYouSolve,
          targetAudience: formData.targetAudience,
          uniqueValue: formData.uniqueValue,
          painPoints: painPoints.filter((p) => p.trim()),
          benefits: benefits.filter((b) => b.trim())
        }
        await updateExistingProduct(id, updateData)
        navigate(`/products/${id}`)
      }
    } catch (error) {
      console.error("Failed to save product:", error)
    }
  }

  const handleCancel = () => {
    navigate("/products")
  }

  if (loading && !isNew) {
    return (
      <Stack gap="xl">
        <Skeleton height={60} />
        <Skeleton height={400} />
      </Stack>
    )
  }

  return (
    <Stack gap="xl">
      {/* Header */}
      <Box
        style={{
          background:
            "linear-gradient(135deg, rgba(124, 58, 237, 0.03) 0%, rgba(109, 40, 217, 0.03) 100%)",
          borderBottom: "1px solid var(--mantine-color-gray-2)",
          marginLeft: "-var(--mantine-spacing-md)",
          marginRight: "-var(--mantine-spacing-md)",
          marginTop: "-var(--mantine-spacing-md)",
          padding: "var(--mantine-spacing-xl) var(--mantine-spacing-md)"
        }}
      >
        <Stack
          gap="md"
          style={{maxWidth: "1200px", margin: "0 auto", width: "100%"}}
        >
          <Group justify="space-between">
            <Box>
              <Title order={2} fw={700} mb={4}>
                {isNew
                  ? duplicateFrom
                    ? "Duplicate Product"
                    : "New Product"
                  : "Edit Product"}
              </Title>
              <Text c="dimmed" size="sm">
                {isNew
                  ? "Define your product to start creating targeted brand messages"
                  : "Update your product definition and details"}
              </Text>
            </Box>
            <Group>
              <Button
                type="button"
                variant="subtle"
                leftSection={<MdCancel size={16} />}
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="product-form"
                variant="gradient"
                gradient={{from: "violet", to: "grape", deg: 135}}
                leftSection={
                  isNew ? <MdAutoAwesome size={16} /> : <MdSave size={16} />
                }
                styles={{
                  root: {
                    transition: "transform 0.2s ease",
                    "&:hover": {transform: "translateY(-1px)"}
                  }
                }}
              >
                {isNew ? "Create Product" : "Save Changes"}
              </Button>
            </Group>
          </Group>
        </Stack>
      </Box>

      <form id="product-form" onSubmit={handleSubmit}>
        <Stack gap="xl">
          {/* Form */}
          <Stack
            gap="lg"
            style={{maxWidth: "800px", margin: "0 auto", width: "100%"}}
          >
            <TextInput
              label="Product Name"
              placeholder="Enter a short, memorable name"
              value={formData.shortName}
              onChange={(e) =>
                setFormData({...formData, shortName: e.target.value})
              }
              required
              description="The main title for this product (e.g., 'Pro Plan', 'Enterprise', 'Starter')"
              size="md"
              styles={{
                input: {
                  "&:focus": {
                    borderColor: "var(--mantine-color-violet-5)"
                  }
                }
              }}
            />

            <Textarea
              label="Product Description"
              placeholder="Describe what this product offers"
              value={formData.product}
              onChange={(e) =>
                setFormData({...formData, product: e.target.value})
              }
              minRows={3}
              maxRows={6}
              autosize
              required
              description="A brief description of what product or service you're offering"
              size="md"
              styles={{
                input: {
                  "&:focus": {
                    borderColor: "var(--mantine-color-violet-5)"
                  }
                }
              }}
            />

            <Textarea
              label="Problem You Solve"
              placeholder="Describe the problem you solve for customers"
              value={formData.problemYouSolve}
              onChange={(e) =>
                setFormData({...formData, problemYouSolve: e.target.value})
              }
              minRows={6}
              maxRows={12}
              autosize
              description="Optional: What specific problem does your product solve?"
              size="md"
              styles={{
                input: {
                  "&:focus": {
                    borderColor: "var(--mantine-color-violet-5)"
                  }
                }
              }}
            />

            <Textarea
              label="Target Audience"
              placeholder="Describe your target audience"
              value={formData.targetAudience}
              onChange={(e) =>
                setFormData({...formData, targetAudience: e.target.value})
              }
              minRows={6}
              maxRows={12}
              autosize
              required
              description="Who is your ideal customer?"
              size="md"
              styles={{
                input: {
                  "&:focus": {
                    borderColor: "var(--mantine-color-violet-5)"
                  }
                }
              }}
            />

            <Textarea
              label="Unique Value"
              placeholder="What makes your product unique?"
              value={formData.uniqueValue}
              onChange={(e) =>
                setFormData({...formData, uniqueValue: e.target.value})
              }
              minRows={6}
              maxRows={12}
              autosize
              required
              description="What sets your product apart from competitors?"
              size="md"
              styles={{
                input: {
                  "&:focus": {
                    borderColor: "var(--mantine-color-violet-5)"
                  }
                }
              }}
            />

            {/* Pain Points - Only show in edit mode */}
            {!isNew && (
              <Card padding="lg" radius="md" withBorder>
                <Group justify="space-between" mb="md">
                  <Text fw={600} size="lg">
                    Pain Points
                  </Text>
                  <Button
                    size="sm"
                    variant="light"
                    leftSection={<IconAdd size={16} />}
                    onClick={handleAddPainPoint}
                  >
                    Add Pain Point
                  </Button>
                </Group>
                <Stack gap="sm">
                  {painPoints.map((point, index) => (
                    <Group key={index} gap="xs">
                      <TextInput
                        placeholder="Enter a pain point your product solves"
                        value={point}
                        onChange={(e) =>
                          handlePainPointChange(index, e.target.value)
                        }
                        style={{flex: 1}}
                      />
                      <ActionIcon
                        color="red"
                        variant="light"
                        onClick={() => handleRemovePainPoint(index)}
                        disabled={painPoints.length === 1}
                      >
                        <IconDelete size={16} />
                      </ActionIcon>
                    </Group>
                  ))}
                </Stack>
              </Card>
            )}

            {/* Benefits - Only show in edit mode */}
            {!isNew && (
              <Card padding="lg" radius="md" withBorder>
                <Group justify="space-between" mb="md">
                  <Text fw={600} size="lg">
                    Benefits
                  </Text>
                  <Button
                    size="sm"
                    variant="light"
                    leftSection={<IconAdd size={16} />}
                    onClick={handleAddBenefit}
                  >
                    Add Benefit
                  </Button>
                </Group>
                <Stack gap="sm">
                  {benefits.map((benefit, index) => (
                    <Group key={index} gap="xs">
                      <TextInput
                        placeholder="Enter a key benefit of your product"
                        value={benefit}
                        onChange={(e) =>
                          handleBenefitChange(index, e.target.value)
                        }
                        style={{flex: 1}}
                      />
                      <ActionIcon
                        color="red"
                        variant="light"
                        onClick={() => handleRemoveBenefit(index)}
                        disabled={benefits.length === 1}
                      >
                        <IconDelete size={16} />
                      </ActionIcon>
                    </Group>
                  ))}
                </Stack>
              </Card>
            )}
          </Stack>
        </Stack>
      </form>
    </Stack>
  )
}

export default ProductForm
