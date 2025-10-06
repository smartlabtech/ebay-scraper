import axiosInstance from "../api/axios"

class ProjectProductsService {
  constructor() {
    // Track ongoing requests to prevent duplicates
    this.projectProductsPromises = new Map();
    this.versionPromises = new Map();
  }
  // Get all versions for a project
  async getProjectProducts(projectId) {
    try {
      // Check if this project's products are already being fetched
      if (this.projectProductsPromises.has(projectId)) {
        console.log(`Project products for ${projectId} already being fetched, reusing existing request`);
        return this.projectProductsPromises.get(projectId);
      }

      console.log('Fetching products for project ID:', projectId);

      // Create the request promise
      const promise = axiosInstance.get(`/en/project/${projectId}`)
        .then(response => {
          console.log('Project response:', response.data);
          // The versions are in the 'versions' array of the project response
          const versions = response.data.versions || [];
          console.log('Extracted versions:', versions);
          return versions;
        })
        .finally(() => {
          // Clean up after completion
          this.projectProductsPromises.delete(projectId);
        });

      // Store the promise
      this.projectProductsPromises.set(projectId, promise);

      return promise;
    } catch (error) {
      console.error("Error fetching project versions:", error)
      throw error
    }
  }

  // Get single product
  async getVersion(versionId) {
    try {
      // Check if this version is already being fetched
      if (this.versionPromises.has(versionId)) {
        console.log(`Version ${versionId} already being fetched, reusing existing request`);
        return this.versionPromises.get(versionId);
      }

      // Create the request promise
      const promise = axiosInstance.get(`/en/project-product/${versionId}`)
        .then(response => response.data)
        .finally(() => {
          // Clean up after completion
          this.versionPromises.delete(versionId);
        });

      // Store the promise
      this.versionPromises.set(versionId, promise);

      return promise;
    } catch (error) {
      console.error("Error fetching product:", error)
      throw error
    }
  }

  // Create new product
  async createVersion(versionData) {
    try {
      const response = await axiosInstance.post(
        "/en/project-product",
        versionData
      )
      return response.data
    } catch (error) {
      console.error("Error creating product:", error)
      throw error
    }
  }

  // Update product
  async updateVersion(versionId, updates) {
    try {
      const response = await axiosInstance.patch(
        `/en/project-product/${versionId}`,
        updates
      )
      return response.data
    } catch (error) {
      console.error("Error updating product:", error)
      throw error
    }
  }

  // Delete product
  async deleteVersion(versionId) {
    try {
      await axiosInstance.delete(`/en/project-product/${versionId}`)
      return {success: true, deletedId: versionId}
    } catch (error) {
      console.error("Error deleting product:", error)
      throw error
    }
  }
}

// Create and export service instance
const projectProductsService = new ProjectProductsService()
export default projectProductsService
