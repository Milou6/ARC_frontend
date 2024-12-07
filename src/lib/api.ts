import { StepOutput, Task } from '../types/types';

// export const API_ROOT = 'api';
// export const API_ROOT = 'http://127.0.0.1:5000';
export const API_ROOT = import.meta.env.VITE_API_ROOT;

export async function getAllTaskIds(): Promise<object> {
  const result = await fetch(`${API_ROOT}/task_ids`, {
    method: 'GET',
    credentials: 'include',
  });
  return await result.json();
}

export async function getPrimitiveNames(): Promise<{ primitives: string[] }> {
  const result = await fetch(`${API_ROOT}/primitives`, {
    method: 'GET',
    credentials: 'include',
  });
  return await result.json();
}

export async function getClosestTasks(): Promise<object> {
  const result = await fetch(`${API_ROOT}/closest_tasks`, {
    method: 'GET',
    credentials: 'include',
  });
  return await result.json();
}

export async function getTrainingTask(taskId: string): Promise<Task> {
  const result = await fetch(`${API_ROOT}/dataset/training/${taskId}`, {
    method: 'GET',
    credentials: 'include',
  });
  return await result.json();
}

export async function resetToTrainingTask(taskId: string): Promise<Task> {
  const res = await fetch(`${API_ROOT}/demonstration/reset/${taskId}`, {
    method: 'GET',
    credentials: 'include',
  });
  const json = await res.json();

  return {
    train: json.train,
    test: json.test,
    demoActions: json['demo_action_list'],
  };
}

export async function stepDemonstration(taskId: string): Promise<StepOutput | undefined> {
  const result = await fetch(`${API_ROOT}/demonstration/step/${taskId}`, {
    method: 'GET',
    credentials: 'include',
  });
  if (result.status != 200) {
    return undefined;
  }
  const json = await result.json();
  json.current_grids = json.current_grids.map((jsonString: string) => JSON.parse(jsonString));
  return json;
}

export async function stepAllDemonstration(taskId: string): Promise<StepOutput[] | undefined> {
  const result = await fetch(`${API_ROOT}/demonstration/step-all/${taskId}`, {
    method: 'GET',
    credentials: 'include',
  });
  if (result.status != 200) {
    return undefined;
  }
  const json = await result.json();

  for (const step of json) {
    step.current_grids = step.current_grids.map((jsonString: string) => JSON.parse(jsonString));
    step.memory_grids = JSON.parse(step.memory_grids);
  }
  return json;
}

export async function setNewDemoList(taskId: string, actionsList: string[]): Promise<object> {
  const result = await fetch(`${API_ROOT}/demonstration/set-new-list/${taskId}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(actionsList),
  });
  const json = await result.json();
  return json;
}
