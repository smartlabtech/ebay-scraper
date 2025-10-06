import {useDispatch, useSelector} from "react-redux"
import {useCallback} from "react"
import {
  fetchProjectProducts,
  fetchVersionById,
  createVersion,
  updateVersion,
  deleteVersion,
  clearCurrentVersion,
  selectProductsByProject,
  selectCurrentVersion,
  selectProductsLoading,
  selectProductsError
} from "../store/slices/projectProductsSlice"
import {useNotifications} from "./useNotifications"

// Track ongoing requests to prevent duplicates
const projectProductsLoadingPromises = {};

export const useProjectProducts = (projectId) => {
  const dispatch = useDispatch()
  const {notifySuccess, notifyError} = useNotifications()

  const versions = useSelector(selectProductsByProject(projectId))
  const currentVersion = useSelector(selectCurrentVersion)
  const loading = useSelector(selectProductsLoading)
  const error = useSelector(selectProductsError)
  
  console.log('useProjectProducts hook - projectId:', projectId, 'versions:', versions)

  // Fetch versions for project
  const loadProducts = useCallback(async (forceReload = false) => {
    if (!projectId) return

    // If there's an ongoing request for this project, return that promise
    if (projectProductsLoadingPromises[projectId] && !forceReload) {
      console.log(`Project products already loading for ${projectId}, returning existing promise`)
      return projectProductsLoadingPromises[projectId]
    }

    // Create the loading promise
    projectProductsLoadingPromises[projectId] = (async () => {
      try {
        const result = await dispatch(fetchProjectProducts(projectId)).unwrap()
        return result
      } catch (error) {
        console.error("Failed to load versions:", error)
        notifyError("Failed to load versions")
        throw error
      } finally {
        // Clear the promise when done
        delete projectProductsLoadingPromises[projectId]
      }
    })()

    return projectProductsLoadingPromises[projectId]
  }, [dispatch, projectId, notifyError])

  // Fetch single version
  const loadVersion = useCallback(
    async (versionId) => {
      try {
        const result = await dispatch(fetchVersionById(versionId)).unwrap()
        return result
      } catch (error) {
        console.error("Failed to load version:", error)
        notifyError("Failed to load version")
        throw error
      }
    },
    [dispatch, notifyError]
  )

  // Create new version
  const createNewVersion = useCallback(
    async (versionData) => {
      try {
        const result = await dispatch(createVersion(versionData)).unwrap()
        notifySuccess("Version created successfully")
        return result
      } catch (error) {
        console.error("Failed to create version:", error)
        notifyError("Failed to create version")
        throw error
      }
    },
    [dispatch, notifySuccess, notifyError]
  )

  // Update existing version
  const updateExistingVersion = useCallback(
    async (versionId, updates) => {
      try {
        const result = await dispatch(
          updateVersion({versionId, updates})
        ).unwrap()
        notifySuccess("Version updated successfully")
        return result
      } catch (error) {
        console.error("Failed to update version:", error)
        notifyError("Failed to update version")
        throw error
      }
    },
    [dispatch, notifySuccess, notifyError]
  )

  // Delete version
  const removeVersion = useCallback(
    async (versionId) => {
      try {
        await dispatch(deleteVersion(versionId)).unwrap()
        notifySuccess("Version deleted successfully")
      } catch (error) {
        console.error("Failed to delete version:", error)
        notifyError("Failed to delete version")
        throw error
      }
    },
    [dispatch, notifySuccess, notifyError]
  )

  // Clear current version
  const clearVersion = useCallback(() => {
    dispatch(clearCurrentVersion())
  }, [dispatch])

  // Get version by ID from loaded versions
  const getVersionById = useCallback(
    (versionId) => {
      return versions.find((v) => v._id === versionId)
    },
    [versions]
  )

  return {
    versions,
    currentVersion,
    loading,
    error,
    loadProducts,
    loadVersion,
    createNewVersion,
    updateExistingVersion,
    removeVersion,
    deleteVersion: removeVersion, // Alias for removeVersion
    clearVersion,
    getVersionById
  }
}
