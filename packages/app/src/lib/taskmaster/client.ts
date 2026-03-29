// TaskMaster API client class

import type { TaskMasterConfig, TaskMasterTask, TaskMasterResponse } from './types';

export class TaskMasterService {
  private config: TaskMasterConfig | null = null;

  configure(config: TaskMasterConfig) {
    this.config = config;
  }

  isConfigured(): boolean {
    return this.config !== null &&
           this.config.apiKey.length > 0 &&
           this.config.defaultProjectId.length > 0;
  }

  private async request(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    if (!this.config) {
      throw new Error('TaskMaster not configured');
    }

    const url = `${this.config.apiUrl}${endpoint}`;

    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
        ...options.headers,
      },
    });
  }

  async createTask(task: Omit<TaskMasterTask, 'id' | 'projectId'>): Promise<TaskMasterResponse> {
    if (!this.isConfigured()) {
      return { success: false, error: 'TaskMaster not configured' };
    }

    try {
      const response = await this.request('/api/tasks', {
        method: 'POST',
        body: JSON.stringify({
          projectId: this.config!.defaultProjectId,
          ...task,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('TaskMaster createTask error:', error);
        return { success: false, error };
      }

      const createdTask = await response.json();
      return { success: true, task: createdTask };
    } catch (error) {
      console.error('TaskMaster createTask error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create task'
      };
    }
  }

  async updateTask(taskId: string, updates: Partial<TaskMasterTask>): Promise<TaskMasterResponse> {
    if (!this.isConfigured()) {
      return { success: false, error: 'TaskMaster not configured' };
    }

    try {
      const response = await this.request(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('TaskMaster updateTask error:', error);
        return { success: false, error };
      }

      const updatedTask = await response.json();
      return { success: true, task: updatedTask };
    } catch (error) {
      console.error('TaskMaster updateTask error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update task'
      };
    }
  }

  async searchTasks(query: string): Promise<{ success: boolean; tasks?: TaskMasterTask[]; error?: string }> {
    if (!this.isConfigured()) {
      return { success: false, error: 'TaskMaster not configured' };
    }

    try {
      const response = await this.request(`/api/tasks/search?q=${encodeURIComponent(query)}`);

      if (!response.ok) {
        const error = await response.text();
        return { success: false, error };
      }

      const tasks = await response.json();
      return { success: true, tasks };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search tasks'
      };
    }
  }

  async getTask(taskId: string): Promise<TaskMasterResponse> {
    if (!this.isConfigured()) {
      return { success: false, error: 'TaskMaster not configured' };
    }

    try {
      const response = await this.request(`/api/tasks/${taskId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const error = await response.text();
        return { success: false, error };
      }

      const task = await response.json();
      return { success: true, task };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get task',
      };
    }
  }
}

// Singleton instance
export const taskmasterService = new TaskMasterService();
