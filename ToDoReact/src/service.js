
import axios from "axios";

const instance = axios.create({
  baseURL: `https://${process.env.REACT_APP_API_DOMAIN}`,
});


instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      return (window.location.href = "/login");
    }
    console.log("API Error:", error.response || error.message || error);

    if (!error.response) {
      console.log("Network or server error occurred");
    }
    return Promise.reject(error.message);
  }
);

function saveAccessToken(authResult) {
  localStorage.setItem("access_token", authResult.token);
  setAuthorizationBearer();
}

function setAuthorizationBearer() {
  const accessToken = localStorage.getItem("access_token");
  if (accessToken) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  }
}
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


  login: async (username, password) => {
    const response = await instance.post(`/login`, { username, password });
    const { token } = response.data;

    saveAccessToken({ token });
    return token;
  },

  register: async (username, password) => {
    const response = await instance.post(`/register`, { username, password });
    const { token } = response.data;
    saveAccessToken({ token });
    return token;
  },


  logout: () => {
    localStorage.removeItem("access_token");
    delete instance.defaults.headers.common["Authorization"];
    window.location.href = "/";
  },
};
