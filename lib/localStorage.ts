const STORAGE_KEY = 'habit-tracker-tasks';

export function saveTasks(tasks: any[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }
}

export function loadTasks(): any[] {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error parsing stored tasks:', error);
        return [];
      }
    }
  }
  return [];
}

export function clearTasks(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}