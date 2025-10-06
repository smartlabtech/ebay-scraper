import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import projectProductsService from "../../services/projectProducts"

// Async thunks
export const fetchProjectProducts = createAsyncThunk(
  "projectProducts/fetchProjectProducts",
  async (projectId) => {
    console.log('fetchProjectProducts thunk - projectId:', projectId);
    const response = await projectProductsService.getProjectProducts(projectId)
    console.log('fetchProjectProducts thunk - response:', response);
    return {projectId, versions: response}
  }
)

export const fetchVersionById = createAsyncThunk(
  "projectProducts/fetchVersionById",
  async (versionId) => {
    const response = await projectProductsService.getVersion(versionId)
    return response
  }
)

export const createVersion = createAsyncThunk(
  "projectProducts/createVersion",
  async (versionData) => {
    const response = await projectProductsService.createVersion(versionData)
    return response
  }
)

export const updateVersion = createAsyncThunk(
  "projectProducts/updateVersion",
  async ({versionId, updates}) => {
    const response = await projectProductsService.updateVersion(
      versionId,
      updates
    )
    return response
  }
)

export const deleteVersion = createAsyncThunk(
  "projectProducts/deleteVersion",
  async (versionId) => {
    await projectProductsService.deleteVersion(versionId)
    return versionId
  }
)

// Initial state
const initialState = {
  versionsByProject: {}, // { projectId: [versions] }
  currentVersion: null,
  loading: false,
  error: null
}

// Project versions slice
const projectProductsSlice = createSlice({
  name: "projectProducts",
  initialState,
  reducers: {
    clearCurrentVersion: (state) => {
      state.currentVersion = null
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    // Fetch project versions
    builder
      .addCase(fetchProjectProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProjectProducts.fulfilled, (state, action) => {
        state.loading = false
        const {projectId, versions} = action.payload
        console.log('fetchProjectProducts.fulfilled - storing versions for project:', projectId, versions);
        state.versionsByProject[projectId] = versions
      })
      .addCase(fetchProjectProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch versions"
      })

    // Fetch version by ID
    builder
      .addCase(fetchVersionById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchVersionById.fulfilled, (state, action) => {
        state.loading = false
        state.currentVersion = action.payload
      })
      .addCase(fetchVersionById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch version"
      })

    // Create version
    builder
      .addCase(createVersion.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createVersion.fulfilled, (state, action) => {
        state.loading = false
        const projectId = action.payload.projectId
        if (!state.versionsByProject[projectId]) {
          state.versionsByProject[projectId] = []
        }
        state.versionsByProject[projectId].push(action.payload)
      })
      .addCase(createVersion.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to create version"
      })

    // Update version
    builder
      .addCase(updateVersion.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateVersion.fulfilled, (state, action) => {
        state.loading = false
        const updatedVersion = action.payload
        const projectId = updatedVersion.projectId

        if (state.versionsByProject[projectId]) {
          const index = state.versionsByProject[projectId].findIndex(
            (v) => v._id === updatedVersion._id
          )
          if (index !== -1) {
            state.versionsByProject[projectId][index] = updatedVersion
          }
        }

        if (state.currentVersion?._id === updatedVersion._id) {
          state.currentVersion = updatedVersion
        }
      })
      .addCase(updateVersion.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to update version"
      })

    // Delete version
    builder
      .addCase(deleteVersion.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteVersion.fulfilled, (state, action) => {
        state.loading = false
        const deletedId = action.payload

        // Remove from all project arrays
        Object.keys(state.versionsByProject).forEach((projectId) => {
          state.versionsByProject[projectId] = state.versionsByProject[
            projectId
          ].filter((v) => v._id !== deletedId)
        })

        if (state.currentVersion?._id === deletedId) {
          state.currentVersion = null
        }
      })
      .addCase(deleteVersion.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to delete version"
      })
  }
})

// Export actions
export const {clearCurrentVersion, clearError} = projectProductsSlice.actions

// Export selectors
export const selectProductsByProject = (projectId) => (state) => {
  console.log('selectProductsByProject - projectId:', projectId);
  console.log('selectProductsByProject - versionsByProject:', state.projectProducts.versionsByProject);
  console.log('selectProductsByProject - versions for project:', state.projectProducts.versionsByProject[projectId]);
  return state.projectProducts.versionsByProject[projectId] || [];
}
export const selectCurrentVersion = (state) =>
  state.projectProducts.currentVersion
export const selectProductsLoading = (state) => state.projectProducts.loading
export const selectProductsError = (state) => state.projectProducts.error

// Export reducer
export default projectProductsSlice.reducer
