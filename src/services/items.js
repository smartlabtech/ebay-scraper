import axiosInstance from '../api/axios';

class ItemsService {
  // Get items with filters and pagination
  async getItems(params = {}) {
    try {
      // Build query string from params
      const queryParams = new URLSearchParams();

      // Add all parameters to query string
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const response = await axiosInstance.get(`/items?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch items');
    }
  }

  // Get single item by ID
  async getItemById(id) {
    try {
      const response = await axiosInstance.get(`/items/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch item details');
    }
  }

  // Get items with advanced filters
  async getItemsWithFilters(filters = {}) {
    try {
      const {
        page = 1,
        limit = 50,
        link,
        title,
        keywordId,
        storeLink,
        category,
        stage,
        locatedIn,
        createdAt,
        priceMin,
        priceMax,
        reviewMin,
        reviewMax,
        availableMin,
        availableMax,
        itemSoldMin,
        itemSoldMax,
        search,
        sortProperty,
        sortType
      } = filters;

      const params = {
        page,
        limit,
        ...(link && { link }),
        ...(title && { title }),
        ...(keywordId && { keywordId }),
        ...(storeLink && { storeLink }),
        ...(category && { category }),
        ...(stage && { stage }),
        ...(locatedIn && { locatedIn }),
        ...(createdAt && { createdAt }),
        ...(priceMin !== undefined && { priceMin }),
        ...(priceMax !== undefined && { priceMax }),
        ...(reviewMin !== undefined && { reviewMin }),
        ...(reviewMax !== undefined && { reviewMax }),
        ...(availableMin !== undefined && { availableMin }),
        ...(availableMax !== undefined && { availableMax }),
        ...(itemSoldMin !== undefined && { itemSoldMin }),
        ...(itemSoldMax !== undefined && { itemSoldMax }),
        ...(search && { search }),
        ...(sortProperty && { sortProperty }),
        ...(sortType && { sortType })
      };

      return await this.getItems(params);
    } catch (error) {
      throw new Error('Failed to fetch items with filters');
    }
  }
}

// Create and export items service instance
const itemsService = new ItemsService();
export default itemsService;
