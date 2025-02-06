import axios from "axios";

const instance = axios.create({
  baseURL: `https://${process.env.REACT_APP_API_DOMAIN}`,
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("bsd");
    console.log("API Error:", error.response || error.message || error);

    if (!error.response) {
      console.log("Network or server error occurred");
    }
    return Promise.reject(error.message);
  }
);
export default {
  getTasks: async () => {
    const result = await instance.get(`/tasks`);
    return result.data;
  },

  addTask: async (name) => {
    console.log("addTask", name);

    const newTask = { name, isComplete: false };
    const result = await instance.post(`/tasks`, newTask);
    return result.data;
  },

  setCompleted: async (id, isComplete) => {
    const updatedTask = { id, isComplete };
    const result = await instance.put(`/tasks/${id}`, updatedTask);
    return result.data;
  },

  deleteTask: async (id) => {
    await instance.delete(`/tasks/${id}`);
    return { id };
  },
};
