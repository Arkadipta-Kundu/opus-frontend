import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include basic auth credentials
api.interceptors.request.use(
    (config) => {
        const userName = localStorage.getItem('userName');
        const password = localStorage.getItem('password');

        // Skip auth for public endpoints
        const publicEndpoints = [
            '/auth/create-user',
            '/auth/user-varification/login',
            '/auth/user-varification/forget-password',
            '/auth/user-varification/reset-password',
            '/public/'
        ];

        const isPublicEndpoint = publicEndpoints.some(endpoint =>
            config.url?.includes(endpoint)
        );

        if (userName && password && !isPublicEndpoint) {
            // Create Basic Auth header
            const credentials = btoa(`${userName}:${password}`);
            config.headers.Authorization = `Basic ${credentials}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear stored credentials on auth failure
            localStorage.removeItem('userName');
            localStorage.removeItem('password');
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: async (userName, password) => {
        try {
            console.log('Attempting login for user:', userName);

            // First, try to login without storing credentials
            const response = await axios.post(`${API_BASE_URL}/auth/user-varification/login`, null, {
                params: { userName, password },
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log('Login response:', response.data);

            if (response.data === true) {
                // Store credentials for future requests
                localStorage.setItem('userName', userName);
                localStorage.setItem('password', password);
                localStorage.setItem('authToken', 'basic-auth-active');
                console.log('Login successful, credentials stored');
                return true;
            }
            console.log('Login failed: response was not true');
            return false;
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            throw error;
        }
    },

    register: async (userData) => {
        const response = await api.post('/auth/create-user', userData);
        return response.data;
    },

    sendOtp: async () => {
        const response = await api.post('/auth/user-varification/send');
        return response.data;
    },

    verifyOtp: async (otp) => {
        const response = await api.post('/auth/user-varification/verify', null, {
            params: { otp }
        });
        return response.data;
    },

    isEmailVerified: async () => {
        try {
            console.log('Checking email verification status...');
            const response = await api.get('/auth/user-varification/is-verified');
            console.log('Email verification response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Email verification check failed:', error.response?.data || error.message);
            throw error;
        }
    },

    forgetPassword: async (email) => {
        // Send as URL parameter to match @RequestParam in Spring Boot
        const response = await axios.post(`${API_BASE_URL}/auth/user-varification/forget-password`, null, {
            params: {
                input: email
            },
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return response.data;
    },

    resetPassword: async (token, newPassword) => {
        // Send token as URL parameter and password in request body to match backend
        const response = await axios.post(`${API_BASE_URL}/auth/user-varification/reset-password`, {
            newPassword: newPassword
        }, {
            params: {
                token: token
            },
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return response.data;
    }
};

export const taskService = {
    getTasks: async () => {
        const response = await api.get('/tasks');
        return response.data;
    },

    getTaskById: async (id) => {
        const response = await api.get(`/tasks/${id}`);
        return response.data;
    },

    createTask: async (taskData) => {
        const response = await api.post('/tasks', taskData);
        return response.data;
    },

    updateTask: async (id, taskData) => {
        const response = await api.put(`/tasks/${id}`, taskData);
        return response.data;
    },

    deleteTask: async (id) => {
        const response = await api.delete(`/tasks/${id}`);
        return response.data;
    }
};

export const userService = {
    getUserById: async (id) => {
        const response = await api.get(`/user/${id}`);
        return response.data;
    },

    updateUser: async (id, userData) => {
        const response = await api.put(`/user/${id}`, userData);
        return response.data;
    },

    deleteUser: async (id) => {
        const response = await api.delete(`/user/${id}`);
        return response.data;
    }
};

export default api;
