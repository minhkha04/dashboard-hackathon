import { http } from "./config.js";

export const commitService = {
    getAll: () => {
        return http.get('get-all-commits');
    },
};
