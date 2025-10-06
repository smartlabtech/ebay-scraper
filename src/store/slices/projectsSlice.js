import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import projectsService from '../../services/projects';

// Async thunks
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (filters = {}) => {
    const response = await projectsService.getProjects(filters);
    return response;
  }
);

export const fetchProjectById = createAsyncThunk(
  'projects/fetchProjectById',
  async (projectId) => {
    const response = await projectsService.getProject(projectId);
    return response;
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData) => {
    const response = await projectsService.createProject(projectData);
    return response;
  }
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ projectId, updates }) => {
    const response = await projectsService.updateProject(projectId, updates);
    return response;
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (projectId) => {
    await projectsService.deleteProject(projectId);
    return projectId;
  }
);

export const addCollaborator = createAsyncThunk(
  'projects/addCollaborator',
  async ({ projectId, collaborator }) => {
    const response = await projectsService.addCollaborator(projectId, collaborator);
    return { projectId, project: response };
  }
);

export const removeCollaborator = createAsyncThunk(
  'projects/removeCollaborator',
  async ({ projectId, collaboratorId }) => {
    const response = await projectsService.removeCollaborator(projectId, collaboratorId);
    return { projectId, project: response };
  }
);

export const generateSocialBios = createAsyncThunk(
  'projects/generateSocialBios',
  async (brandMessageId) => {
    const response = await projectsService.generateSocialBios(brandMessageId);
    return response;
  }
);

export const generateSeoMetadata = createAsyncThunk(
  'projects/generateSeoMetadata',
  async (brandMessageId) => {
    const response = await projectsService.generateSeoMetadata(brandMessageId);
    return response;
  }
);

export const updateSocialBios = createAsyncThunk(
  'projects/updateSocialBios',
  async ({ projectId, socialBios }) => {
    const response = await projectsService.updateSocialBios(projectId, socialBios);
    return response;
  }
);

export const updateSeoMetadata = createAsyncThunk(
  'projects/updateSeoMetadata',
  async ({ projectId, seoMetadata }) => {
    const response = await projectsService.updateSeoMetadata(projectId, seoMetadata);
    return response;
  }
);

// Initial state
const initialState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
  filters: {
    status: 'all',
    sortBy: 'updatedAt',
    search: ''
  },
  pagination: {
    page: 1,
    size: 20,
    total: 0,
    totalPages: 0
  }
};

// Projects slice
const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateProjectProgress: (state, action) => {
      const { projectId, progress } = action.payload;
      const project = state.projects.find(p => p.id === projectId);
      if (project) {
        project.progress = progress;
      }
      if (state.currentProject?.id === projectId) {
        state.currentProject.progress = progress;
      }
    }
  },
  extraReducers: (builder) => {
    // Fetch projects
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        
        // Handle both old format (array) and new format (object with data and pagination)
        if (Array.isArray(action.payload)) {
          // Old format - just an array of projects
          state.projects = action.payload;
          state.pagination = {
            page: 1,
            limit: 10,
            total: action.payload.length
          };
        } else if (action.payload?.projects) {
          // New format - object with projects and pagination
          state.projects = action.payload.projects || [];
          state.pagination = action.payload.pagination || {
            page: 1,
            limit: 20,
            total: action.payload.projects?.length || 0
          };
        } else {
          // Fallback
          state.projects = [];
          state.pagination = {
            page: 1,
            limit: 20,
            total: 0
          };
        }
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch projects';
      });

    // Fetch project by ID
    builder
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch project';
      });

    // Create project
    builder
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create project';
      });

    // Update project
    builder
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.projects.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        if (state.currentProject?.id === action.payload.id) {
          state.currentProject = action.payload;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update project';
      });

    // Delete project
    builder
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.filter(p => p.id !== action.payload);
        if (state.currentProject?.id === action.payload) {
          state.currentProject = null;
        }
        state.pagination.total -= 1;
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete project';
      });

    // Add collaborator
    builder
      .addCase(addCollaborator.fulfilled, (state, action) => {
        const { projectId, project } = action.payload;
        const index = state.projects.findIndex(p => p.id === projectId);
        if (index !== -1) {
          state.projects[index] = project;
        }
        if (state.currentProject?.id === projectId) {
          state.currentProject = project;
        }
      });

    // Remove collaborator
    builder
      .addCase(removeCollaborator.fulfilled, (state, action) => {
        const { projectId, project } = action.payload;
        const index = state.projects.findIndex(p => p.id === projectId);
        if (index !== -1) {
          state.projects[index] = project;
        }
        if (state.currentProject?.id === projectId) {
          state.currentProject = project;
        }
      });

    // Generate social bios
    builder
      .addCase(generateSocialBios.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateSocialBios.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.projects.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = { ...state.projects[index], ...action.payload };
        }
        if (state.currentProject?.id === action.payload.id) {
          state.currentProject = { ...state.currentProject, ...action.payload };
        }
      })
      .addCase(generateSocialBios.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to generate social bios';
      });

    // Generate SEO metadata
    builder
      .addCase(generateSeoMetadata.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateSeoMetadata.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.projects.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = { ...state.projects[index], ...action.payload };
        }
        if (state.currentProject?.id === action.payload.id) {
          state.currentProject = { ...state.currentProject, ...action.payload };
        }
      })
      .addCase(generateSeoMetadata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to generate SEO metadata';
      });

    // Update social bios
    builder
      .addCase(updateSocialBios.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSocialBios.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.projects.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = { ...state.projects[index], ...action.payload };
        }
        if (state.currentProject?.id === action.payload.id) {
          state.currentProject = { ...state.currentProject, ...action.payload };
        }
      })
      .addCase(updateSocialBios.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update social bios';
      });

    // Update SEO metadata
    builder
      .addCase(updateSeoMetadata.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSeoMetadata.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.projects.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = { ...state.projects[index], ...action.payload };
        }
        if (state.currentProject?.id === action.payload.id) {
          state.currentProject = { ...state.currentProject, ...action.payload };
        }
      })
      .addCase(updateSeoMetadata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update SEO metadata';
      });
  }
});

// Export actions
export const { setFilters, clearCurrentProject, clearError, updateProjectProgress } = projectsSlice.actions;

// Export selectors
export const selectProjects = (state) => state.projects.projects;
export const selectCurrentProject = (state) => state.projects.currentProject;
export const selectProjectsLoading = (state) => state.projects.loading;
export const selectProjectsError = (state) => state.projects.error;
export const selectProjectFilters = (state) => state.projects.filters;
export const selectProjectsPagination = (state) => state.projects.pagination;

// Export reducer
export default projectsSlice.reducer;