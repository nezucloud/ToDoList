import { POST, GET, PATCH, DELETE } from "../helpers/api-service";

export const ADD_TASK = async (formData) => {
  return POST("task/create", {
    title: formData.title,
    description: formData.description,
    due_date: formData.due_date,
    priority: formData.priority ? "1" : null,
    status: formData.status,
  });
};

export const GET_TASKS = async (params) => {
  return GET(`task/show?${params}`);
};

export const UPDATE_TASK = (payload) => {
  return PATCH(`task/update`, payload);
};

export const DELETE_TASK = (taskId) => {
  return DELETE(`task/delete/${taskId}`);
};
