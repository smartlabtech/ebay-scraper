import axiosInstance from '../api/axios';
import { mockProjects } from '../data/mockData';
import authService from './auth';

class ProjectsService {
  constructor() {
    // Track ongoing requests to prevent duplicates
    this.projectPromises = new Map();
    this.projectsListPromises = new Map();
  }
  // Get all projects for current user
  async getProjects(filters = {}) {
    try {
      // Extract pagination params
      const { page = 1, size = 20, status, type, search, sortBy, ...otherFilters } = filters;

      // Create a cache key for this specific request
      const cacheKey = JSON.stringify({ page, size });

      // Check if this exact request is already in progress
      if (this.projectsListPromises.has(cacheKey)) {
        console.log('Projects list already being fetched with same params, reusing existing request');
        const existingPromise = this.projectsListPromises.get(cacheKey);

        // Apply client-side filters to the cached result
        return existingPromise.then(result => {
          let projects = Array.isArray(result) ? result : result.projects;

          // Apply filters
          if (status && status !== 'all') {
            projects = projects.filter(p => p.status === status);
          }
          if (type) {
            projects = projects.filter(p => p.type === type);
          }
          if (search) {
            const searchLower = search.toLowerCase();
            projects = projects.filter(p =>
              p.name.toLowerCase().includes(searchLower) ||
              (p.description && p.description.toLowerCase().includes(searchLower))
            );
          }

          // Sort
          if (sortBy) {
            projects.sort((a, b) => {
              switch (sortBy) {
                case 'name':
                  return a.name.localeCompare(b.name);
                case 'createdAt':
                  return new Date(b.createdAt) - new Date(a.createdAt);
                case 'updatedAt':
                  return new Date(b.updatedAt) - new Date(a.updatedAt);
                case 'dueDate':
                  return new Date(a.dueDate) - new Date(b.dueDate);
                case 'progress':
                  return b.progress - a.progress;
                default:
                  return 0;
              }
            });
          }

          return result.pagination ? { projects, pagination: result.pagination } : projects;
        });
      }

      // Only pass pagination params to the API
      const apiParams = {
        page,
        size
      };

      // Create the request promise
      const projectsPromise = (async () => {
        // Pass params directly without wrapping in another object
        const response = await axiosInstance.get('/en/project', { params: apiParams });
      // Handle new response format with data and pagination
      const responseData = response.data;
      let projects = responseData.data || responseData || [];
      
      // If it's the old format (direct array), use it as is
      if (Array.isArray(responseData)) {
        projects = responseData;
      }

      // Transform API response to match frontend format
      projects = projects.map(project => ({
        id: project._id,
        name: project.businessName || 'Untitled Project',
        status: project.status || 'active',
        privacy: project.public ? 'public' : 'private',
        type: 'brand',
        userId: project.ownerId,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        // Include all fields from the new DTO
        product: project.product,
        shortName: project.shortName,
        targetAudience: project.targetAudience,
        problemYouSolve: project.problemYouSolve,
        uniqueValue: project.uniqueValue,
        businessName: project.businessName,
        businessType: project.businessType,
        priceRange: project.priceRange,
        businessGoal: project.businessGoal,
        location: project.location,
        businessStage: project.businessStage,
        domainName: project.domainName,
        socialBios: project.socialBios,
        seoMetadata: project.seoMetadata,
        // Also include frontend field names for backward compatibility
        whatYouSell: project.product,
        whoYouSellTo: project.targetAudience,
        // Use statistics from backend if available
        statistics: project.statistics || {
          activeProducts: 0,
          activeBrandMessages: 0,
          activeCopies: 0
        },
        stats: {
          products: project.statistics?.activeProducts || 0,
          messages: project.statistics?.activeBrandMessages || 0,
          copies: project.statistics?.activeCopies || 0,
          recordings: 0
        },
        progress: 100
      }));

      // Apply filters
      if (filters.status && filters.status !== 'all') {
        projects = projects.filter(p => p.status === filters.status);
      }
      if (filters.type) {
        projects = projects.filter(p => p.type === filters.type);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        projects = projects.filter(p => 
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
        );
      }

      // Sort
      if (filters.sortBy) {
        projects.sort((a, b) => {
          switch (filters.sortBy) {
            case 'name':
              return a.name.localeCompare(b.name);
            case 'createdAt':
              return new Date(b.createdAt) - new Date(a.createdAt);
            case 'updatedAt':
              return new Date(b.updatedAt) - new Date(a.updatedAt);
            case 'dueDate':
              return new Date(a.dueDate) - new Date(b.dueDate);
            case 'progress':
              return b.progress - a.progress;
            default:
              return 0;
          }
        });
      }

      // Return projects with pagination info if available
      if (responseData.pagination) {
        return {
          projects,
          pagination: responseData.pagination
        };
      }

      // Return just projects for backward compatibility
      return projects;
      })();

      // Store the promise
      this.projectsListPromises.set(cacheKey, projectsPromise);

      // Clean up after completion
      projectsPromise.finally(() => {
        this.projectsListPromises.delete(cacheKey);
      });

      // Apply filters to the result
      return projectsPromise.then(result => {
        let projects = Array.isArray(result) ? result : result.projects;

        // Apply filters
        if (filters.status && filters.status !== 'all') {
          projects = projects.filter(p => p.status === filters.status);
        }
        if (filters.type) {
          projects = projects.filter(p => p.type === filters.type);
        }
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          projects = projects.filter(p =>
            p.name.toLowerCase().includes(searchLower) ||
            (p.description && p.description.toLowerCase().includes(searchLower))
          );
        }

        // Sort
        if (filters.sortBy) {
          projects.sort((a, b) => {
            switch (filters.sortBy) {
              case 'name':
                return a.name.localeCompare(b.name);
              case 'createdAt':
                return new Date(b.createdAt) - new Date(a.createdAt);
              case 'updatedAt':
                return new Date(b.updatedAt) - new Date(a.updatedAt);
              case 'dueDate':
                return new Date(a.dueDate) - new Date(b.dueDate);
              case 'progress':
                return b.progress - a.progress;
              default:
                return 0;
            }
          });
        }

        return result.pagination ? { projects, pagination: result.pagination } : projects;
      });
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }

  // Get single project
  async getProject(projectId) {
    try {
      // Check if this project is already being fetched
      if (this.projectPromises.has(projectId)) {
        console.log(`Project ${projectId} already being fetched, reusing existing request`);
        return this.projectPromises.get(projectId);
      }

      // Create the request promise
      const projectPromise = (async () => {
        const response = await axiosInstance.get(`/en/project/${projectId}`);
        const project = response.data;

      // Transform API response to match frontend format
      return {
        id: project._id,
        name: project.businessName || 'Untitled Project',
        status: 'active',
        privacy: project.public ? 'public' : 'private',
        type: 'brand',
        userId: project.ownerId,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        // Include all fields from the new DTO
        product: project.product,
        shortName: project.shortName,
        targetAudience: project.targetAudience,
        problemYouSolve: project.problemYouSolve,
        uniqueValue: project.uniqueValue,
        businessName: project.businessName,
        businessType: project.businessType,
        priceRange: project.priceRange,
        businessGoal: project.businessGoal,
        location: project.location,
        businessStage: project.businessStage,
        domainName: project.domainName,
        socialBios: project.socialBios,
        seoMetadata: project.seoMetadata,
        // Also include frontend field names for backward compatibility
        whatYouSell: project.product,
        whoYouSellTo: project.targetAudience,
        // Use statistics from backend if available
        statistics: project.statistics || {
          activeProducts: 0,
          activeBrandMessages: 0,
          activeCopies: 0
        },
        stats: {
          products: project.statistics?.activeProducts || 0,
          messages: project.statistics?.activeBrandMessages || 0,
          copies: project.statistics?.activeCopies || 0,
          recordings: 0
        },
        progress: 100,
        versions: project.versions || [] // Include versions array from API response
      };
      })();

      // Store the promise
      this.projectPromises.set(projectId, projectPromise);

      // Clean up after completion
      projectPromise
        .finally(() => {
          this.projectPromises.delete(projectId);
        })
        .catch(error => {
          console.error('Error fetching project:', error);
          throw error;
        });

      return projectPromise;
    } catch (error) {
      console.error('Error in getProject:', error);
      throw error;
    }
  }

  // Create project
  async createProject(projectData) {
    try {
      // Extract brand message details from projectData
      const details = projectData || {};
      
      // Format data for API - include only non-empty optional fields
      const apiData = {};
      
      // Map frontend field names to backend DTO field names
      // Only add fields that have actual values, not empty strings
      
      // Map whatYouSell -> product
      if (details.whatYouSell) apiData.product = details.whatYouSell;
      if (details.product) apiData.product = details.product;
      
      // Map shortName
      if (details.shortName) apiData.shortName = details.shortName;
      if (details.name && details.name.length >= 3 && details.name.length <= 50) {
        apiData.shortName = details.name;
      }
      
      // Map whoYouSellTo -> targetAudience
      if (details.whoYouSellTo) apiData.targetAudience = details.whoYouSellTo;
      if (details.targetAudience) apiData.targetAudience = details.targetAudience;
      
      // problemYouSolve stays the same
      if (details.problemYouSolve) apiData.problemYouSolve = details.problemYouSolve;
      
      // uniqueValue stays the same
      if (details.uniqueValue) apiData.uniqueValue = details.uniqueValue;
      
      // businessType stays the same
      if (details.businessType) apiData.businessType = details.businessType;
      
      // businessName stays the same
      if (details.businessName) apiData.businessName = details.businessName;
      
      // priceRange stays the same
      if (details.priceRange) apiData.priceRange = details.priceRange;
      
      // businessGoal stays the same
      if (details.businessGoal) apiData.businessGoal = details.businessGoal;
      
      // location stays the same
      if (details.location) apiData.location = details.location;
      
      // businessStage stays the same
      if (details.businessStage) apiData.businessStage = details.businessStage;
      
      // domainName stays the same  
      if (details.domainName) apiData.domainName = details.domainName;

      console.log('=== PROJECT CREATION API CALL ===');
      console.log('Received projectData:', JSON.stringify(projectData, null, 2));
      console.log('Sending apiData to backend:', JSON.stringify(apiData, null, 2));
      console.log('API Endpoint:', '/en/project');
      console.log('================================');

      const response = await axiosInstance.post('/en/project', apiData);
      console.log('API Response:', response);
      const createdProject = response.data;

      // Transform API response to match frontend format
      return {
        id: createdProject._id,
        name: createdProject.businessName || 'Untitled Project',
        status: 'active',
        privacy: createdProject.public ? 'public' : 'private',
        type: 'brand',
        userId: createdProject.ownerId,
        createdAt: createdProject.createdAt,
        updatedAt: createdProject.updatedAt,
        // Include all fields from the new DTO
        product: createdProject.product,
        shortName: createdProject.shortName,
        targetAudience: createdProject.targetAudience,
        problemYouSolve: createdProject.problemYouSolve,
        uniqueValue: createdProject.uniqueValue,
        businessName: createdProject.businessName,
        businessType: createdProject.businessType,
        priceRange: createdProject.priceRange,
        businessGoal: createdProject.businessGoal,
        location: createdProject.location,
        businessStage: createdProject.businessStage,
        domainName: createdProject.domainName,
        socialBios: createdProject.socialBios,
        seoMetadata: createdProject.seoMetadata,
        // Also include frontend field names for backward compatibility
        whatYouSell: createdProject.product,
        whoYouSellTo: createdProject.targetAudience,
        // Use statistics from backend if available
        statistics: createdProject.statistics || {
          activeProducts: 0,
          activeBrandMessages: 0,
          activeCopies: 0
        },
        stats: {
          products: createdProject.statistics?.activeProducts || 0,
          messages: createdProject.statistics?.activeBrandMessages || 0,
          copies: createdProject.statistics?.activeCopies || 0,
          recordings: 0
        },
        progress: 100,
        versions: createdProject.versions || []
      };
    } catch (error) {
      console.error('=== PROJECT CREATION ERROR ===');
      console.error('Error creating project:', error);
      if (error.response) {
        console.error('Error response status:', error.response.status);
        console.error('Error response data:', error.response.data);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received. Request:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      console.error('=============================');
      throw error;
    }
  }

  // Update project
  async updateProject(projectId, updates) {
    try {
      // Format data for API - handle both direct updates and nested details
      const apiData = {};
      
      const source = updates.details || updates;
      
      // Map frontend field names to backend DTO field names
      // Only include non-empty values
      
      // Map whatYouSell -> product
      if (source.whatYouSell) apiData.product = source.whatYouSell;
      if (source.product) apiData.product = source.product;
      
      // Map shortName
      if (source.shortName) apiData.shortName = source.shortName;
      if (source.name && source.name.length >= 3 && source.name.length <= 50) {
        apiData.shortName = source.name;
      }
      
      // Map whoYouSellTo -> targetAudience
      if (source.whoYouSellTo) apiData.targetAudience = source.whoYouSellTo;
      if (source.targetAudience) apiData.targetAudience = source.targetAudience;
      
      // Direct field mappings
      if (source.problemYouSolve) apiData.problemYouSolve = source.problemYouSolve;
      if (source.uniqueValue) apiData.uniqueValue = source.uniqueValue;
      if (source.businessType) apiData.businessType = source.businessType;
      if (source.businessName) apiData.businessName = source.businessName;
      if (source.priceRange) apiData.priceRange = source.priceRange;
      if (source.businessGoal) apiData.businessGoal = source.businessGoal;
      if (source.location) apiData.location = source.location;
      if (source.businessStage) apiData.businessStage = source.businessStage;
      if (source.domainName) apiData.domainName = source.domainName;
      
      // Add other update fields
      if ('public' in updates) {
        apiData.public = updates.public;
      }
      if (updates.privacy) {
        apiData.public = updates.privacy === 'public';
      }

      const response = await axiosInstance.patch(`/en/project/${projectId}`, apiData);
      const updatedProject = response.data;

      // Transform API response to match frontend format
      return {
        id: updatedProject._id,
        name: updatedProject.businessName || 'Untitled Project',
        status: 'active',
        privacy: updatedProject.public ? 'public' : 'private',
        type: 'brand',
        userId: updatedProject.ownerId,
        createdAt: updatedProject.createdAt,
        updatedAt: updatedProject.updatedAt,
        // Include all fields from the new DTO
        product: updatedProject.product,
        shortName: updatedProject.shortName,
        targetAudience: updatedProject.targetAudience,
        problemYouSolve: updatedProject.problemYouSolve,
        uniqueValue: updatedProject.uniqueValue,
        businessName: updatedProject.businessName,
        businessType: updatedProject.businessType,
        priceRange: updatedProject.priceRange,
        businessGoal: updatedProject.businessGoal,
        location: updatedProject.location,
        businessStage: updatedProject.businessStage,
        domainName: updatedProject.domainName,
        socialBios: updatedProject.socialBios,
        seoMetadata: updatedProject.seoMetadata,
        // Also include frontend field names for backward compatibility
        whatYouSell: updatedProject.product,
        whoYouSellTo: updatedProject.targetAudience,
        // Use statistics from backend if available
        statistics: updatedProject.statistics || {
          activeProducts: 0,
          activeBrandMessages: 0,
          activeCopies: 0
        },
        stats: {
          products: updatedProject.statistics?.activeProducts || 0,
          messages: updatedProject.statistics?.activeBrandMessages || 0,
          copies: updatedProject.statistics?.activeCopies || 0,
          recordings: 0
        },
        progress: 100,
        versions: updatedProject.versions || []
      };
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  // Delete project
  async deleteProject(projectId) {
    try {
      await axiosInstance.delete(`/en/project/${projectId}`);
      return { success: true, deletedId: projectId };
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }

  // Get project statistics
  async getProjectStats(projectId) {
    const project = await this.getProject(projectId);
    
    // Calculate additional stats
    const completionRate = project.progress;
    const daysUntilDue = Math.ceil((new Date(project.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    const isOverdue = daysUntilDue < 0;

    return {
      ...project.stats,
      completionRate,
      daysUntilDue,
      isOverdue,
      lastUpdated: project.updatedAt
    };
  }

  // Duplicate project
  async duplicateProject(projectId) {
    const project = await this.getProject(projectId);
    
    const duplicatedProject = {
      ...project,
      id: Date.now().toString(),
      name: `${project.name} (Copy)`,
      status: 'draft',
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: {
        messages: 0,
        copies: 0,
        recordings: 0
      }
    };

    mockProjects.push(duplicatedProject);

    return duplicatedProject;
  }

  // Archive project
  async archiveProject(projectId) {
    return this.updateProject(projectId, { status: 'archived' });
  }

  // Restore archived project
  async restoreProject(projectId) {
    return this.updateProject(projectId, { status: 'draft' });
  }

  // Get recent projects
  async getRecentProjects(limit = 5) {
    const projects = await this.getProjects({ sortBy: 'updatedAt' });
    return projects.slice(0, limit);
  }

  // Search projects
  async searchProjects(query) {
    return this.getProjects({ search: query });
  }

  // Get projects by status
  async getProjectsByStatus(status) {
    return this.getProjects({ status });
  }

  // Update project progress
  async updateProjectProgress(projectId, progress) {
    return this.updateProject(projectId, { progress });
  }

  // Generate social bios for a project
  async generateSocialBios(brandMessageId) {
    try {
      const response = await axiosInstance.post('/en/project/social-bios/generate', {
        brandMessageId
      });
      const project = response.data;

      // Transform API response to match frontend format
      return {
        id: project._id,
        name: project.businessName || 'Untitled Project',
        status: project.status || 'active',
        privacy: project.public ? 'public' : 'private',
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        socialBios: project.socialBios,
        tokensUsed: project.tokensUsed
      };
    } catch (error) {
      console.error('Error generating social bios:', error);
      throw error;
    }
  }

  // Generate SEO metadata for a project
  async generateSeoMetadata(brandMessageId) {
    try {
      const response = await axiosInstance.post('/en/project/seo-metadata/generate', {
        brandMessageId
      });
      const project = response.data;

      // Transform API response to match frontend format
      return {
        id: project._id,
        name: project.businessName || 'Untitled Project',
        status: project.status || 'active',
        privacy: project.public ? 'public' : 'private',
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        seoMetadata: project.seoMetadata,
        tokensUsed: project.tokensUsed
      };
    } catch (error) {
      console.error('Error generating SEO metadata:', error);
      throw error;
    }
  }

  // Update social bios for a project
  async updateSocialBios(projectId, socialBios) {
    try {
      // Filter out empty fields - backend might not accept empty strings
      const filteredBios = {};
      if (socialBios.facebook) filteredBios.facebook = socialBios.facebook;
      if (socialBios.instagram) filteredBios.instagram = socialBios.instagram;
      if (socialBios.linkedin) filteredBios.linkedin = socialBios.linkedin;
      // Twitter is not supported by the backend
      
      console.log('Updating social bios:', filteredBios);
      const response = await axiosInstance.patch(`/en/project/${projectId}/social-bios`, filteredBios);
      const project = response.data;

      // Transform API response to match frontend format
      return {
        id: project._id,
        name: project.businessName || 'Untitled Project',
        status: project.status || 'active',
        privacy: project.public ? 'public' : 'private',
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        socialBios: project.socialBios
      };
    } catch (error) {
      console.error('Error updating social bios:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      throw error;
    }
  }

  // Update SEO metadata for a project
  async updateSeoMetadata(projectId, seoMetadata) {
    try {
      // Ensure keywords is an array and filter empty values
      const filteredMetadata = {
        title: seoMetadata.title || '',
        description: seoMetadata.description || '',
        keywords: Array.isArray(seoMetadata.keywords) ? seoMetadata.keywords.filter(k => k) : []
      };
      
      console.log('Updating SEO metadata:', filteredMetadata);
      const response = await axiosInstance.patch(`/en/project/${projectId}/seo-metadata`, filteredMetadata);
      const project = response.data;

      // Transform API response to match frontend format
      return {
        id: project._id,
        name: project.businessName || 'Untitled Project',
        status: project.status || 'active',
        privacy: project.public ? 'public' : 'private',
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        seoMetadata: project.seoMetadata
      };
    } catch (error) {
      console.error('Error updating SEO metadata:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      throw error;
    }
  }
}

// Create and export service instance
const projectsService = new ProjectsService();
export default projectsService;