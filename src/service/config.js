import axios from 'axios'

const http = axios.create({
    baseURL: import.meta.env.VITE_API_DOMAIN,
    timeout: 30000,
    headers: {},
})

http.interceptors.request.use()

// Add a response interceptor
http.interceptors.response.use(
    function (response) {
        return response
    },
    function (error) {
        return Promise.reject(error)
    }
)

export { http }