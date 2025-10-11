import { http } from "./config.js";

export const commitService = {
    getAll: () => {
        return http.get('commits/grouped-by-repo');
    },
};
