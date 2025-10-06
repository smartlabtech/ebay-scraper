import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useRef } from 'react';
import { store } from '../store';
import { useLoading } from '../contexts/LoadingContext';
import {
  fetchProjects,
  fetchProjectById,
  createProject,
  updateProject,
  deleteProject,
  setFilters,
  clearCurrentProject,
  selectProjects,
  selectCurrentProject,
  selectProjectsLoading,
  selectProjectsError,
  selectProjectFilters
} from '../store/slices/projectsSlice';
import { useNotifications } from './useNotifications';

// Track ongoing requests to prevent duplicates
let projectsLoadingPromise = null;

export const useProjects = () => {
  const dispatch = useDispatch();
  const { notifySuccess, notifyError } = useNotifications();
  const { showLoading, hideLoading } = useLoading();

  const projects = useSelector(selectProjects) || [];
  const currentProject = useSelector(selectCurrentProject);
  const loading = useSelector(selectProjectsLoading);
  const error = useSelector(selectProjectsError);
  const filters = useSelector(selectProjectFilters);


  // Fetch projects with optional filters
  const loadProjects = useCallback(async (customFilters = {}, forceReload = false) => {
    // Check if we're on pages that don't need projects - prevent loading
    const currentPath = window.location.pathname;
    if (currentPath.startsWith('/settings') || currentPath.startsWith('/dashboard')) {
      console.log('Skipping project load on', currentPath);
      return [];
    }

    // Skip if already loaded and not forcing reload
    const currentProjects = store.getState().projects.projects;
    if (!forceReload && currentProjects.length > 0 && Object.keys(customFilters).length === 0) {
      return currentProjects;
    }

    // If there's an ongoing request, return that promise instead of making a new request
    if (projectsLoadingPromise && !forceReload) {
      console.log('Projects already loading, returning existing promise');
      return projectsLoadingPromise;
    }

    // Create the loading promise
    projectsLoadingPromise = (async () => {
      try {
        // Get current filters from state at call time
        const currentFilters = store.getState().projects.filters;
        const mergedFilters = { ...currentFilters, ...customFilters };
        const result = await dispatch(fetchProjects(mergedFilters)).unwrap();
        return result;
      } catch (error) {
        console.error('Failed to load projects:', error);
        throw error;
      } finally {
        hideLoading('projects');
        projectsLoadingPromise = null; // Clear the promise when done
      }
    })();

    showLoading('projects', 'Loading projects...');
    return projectsLoadingPromise;
  }, [dispatch, showLoading, hideLoading]);

  // Fetch single project
  const loadProject = useCallback(async (projectId) => {
    showLoading('project', 'Loading project details...');
    try {
      const result = await dispatch(fetchProjectById(projectId)).unwrap();
      return result;
    } catch (error) {
      console.error('Failed to load project:', error);
      throw error;
    } finally {
      hideLoading('project');
    }
  }, [dispatch, showLoading, hideLoading]);

  // Create new project
  const createNewProject = useCallback(async (projectData) => {
    showLoading('createProject', 'Creating project...');
    try {
      const result = await dispatch(createProject(projectData)).unwrap();
      return result;
    } catch (error) {
      console.error('Failed to create project:', error);
      throw error;
    } finally {
      hideLoading('createProject');
    }
  }, [dispatch, showLoading, hideLoading]);

  // Update existing project
  const updateExistingProject = useCallback(async (projectId, updates) => {
    showLoading('updateProject', 'Updating project...');
    try {
      const result = await dispatch(updateProject({ projectId, updates })).unwrap();
      return result;
    } catch (error) {
      console.error('Failed to update project:', error);
      throw error;
    } finally {
      hideLoading('updateProject');
    }
  }, [dispatch, showLoading, hideLoading]);

  // Delete project
  const removeProject = useCallback(async (projectId) => {
    showLoading('deleteProject', 'Deleting project...');
    try {
      await dispatch(deleteProject(projectId)).unwrap();
    } catch (error) {
      console.error('Failed to delete project:', error);
      throw error;
    } finally {
      hideLoading('deleteProject');
    }
  }, [dispatch, showLoading, hideLoading]);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  // Clear current project
  const clearProject = useCallback(() => {
    dispatch(clearCurrentProject());
  }, [dispatch]);

  // Get project by ID from loaded projects
  const getProjectById = useCallback((projectId) => {
    return projects.find(p => p.id === projectId);
  }, [projects]);

  // Get projects by status
  const getProjectsByStatus = useCallback((status) => {
    return projects.filter(p => p.status === status);
  }, [projects]);

  // Get active projects
  const getActiveProjects = useCallback(() => {
    return projects.filter(p => p.status === 'active');
  }, [projects]);

  // Get project stats
  const getProjectStats = useCallback(() => {
    const total = projects.length;
    const active = projects.filter(p => p.status === 'active').length;
    const completed = projects.filter(p => p.status === 'completed').length;
    const archived = projects.filter(p => p.status === 'archived').length;
    
    return {
      total,
      active,
      completed,
      archived,
      completionRate: total > 0 ? (completed / total * 100).toFixed(1) : 0
    };
  }, [projects]);

  // Removed automatic loading - let components decide when to load

  return {
    projects,
    currentProject,
    loading,
    error,
    filters,
    loadProjects,
    loadProject,
    addProject: createNewProject,
    createNewProject,
    updateExistingProject,
    deleteProject: removeProject,
    removeProject,
    updateFilters,
    clearProject,
    getProjectById,
    getProjectsByStatus,
    getActiveProjects,
    getProjectStats
  };
};