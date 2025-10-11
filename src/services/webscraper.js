import axiosInstance from '../api/axios';

class WebscraperService {
  // Get webscraper jobs with filters and pagination
  async getWebscraperJobs(params = {}) {
    try {
      // Build query string from params
      const queryParams = new URLSearchParams();

      // Add all parameters to query string
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          // Handle array parameters (e.g., excludeStatus)
          if (Array.isArray(value)) {
            value.forEach(item => {
              queryParams.append(key, item);
            });
          } else {
            queryParams.append(key, value);
          }
        }
      });

      const response = await axiosInstance.get(`/webscraper?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch webscraper jobs');
    }
  }

  // Get single webscraper job by ID
  async getWebscraperJobById(id) {
    try {
      const response = await axiosInstance.get(`/webscraper/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch webscraper job details');
    }
  }

  // Get webscraper jobs with advanced filters
  async getWebscraperJobsWithFilters(filters = {}) {
    try {
      const {
        page = 1,
        limit = 50,
        scrapingjob_id,
        custom_id,
        sitemap_id,
        sitemap_name,
        status,
        excludeStatus,
        scrapingResultMin,
        scrapingResultMax,
        createdAt,
        sortProperty,
        sortType
      } = filters;

      const params = {
        page,
        limit,
        ...(scrapingjob_id && { scrapingjob_id }),
        ...(custom_id && { custom_id }),
        ...(sitemap_id && { sitemap_id }),
        ...(sitemap_name && { sitemap_name }),
        ...(status && { status }),
        ...(excludeStatus && excludeStatus.length > 0 && { excludeStatus }),
        ...(scrapingResultMin !== undefined && { scrapingResultMin }),
        ...(scrapingResultMax !== undefined && { scrapingResultMax }),
        ...(createdAt && { createdAt }),
        ...(sortProperty && { sortProperty }),
        ...(sortType && { sortType })
      };

      return await this.getWebscraperJobs(params);
    } catch (error) {
      throw new Error('Failed to fetch webscraper jobs with filters');
    }
  }

  // Handle scraped data
  async handleScraped() {
    try {
      const response = await axiosInstance.post('/webscraper/handle-scraped');
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to handle scraped data');
    }
  }

  // Reset stuck job
  async resetStuckJob(id) {
    try {
      const response = await axiosInstance.patch(`/webscraper/reset-stuck-job/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to reset stuck job');
    }
  }
}

// Create and export webscraper service instance
const webscraperService = new WebscraperService();
export default webscraperService;
