import CommitService from '../services/commit.service.js';
import { successResponse } from '../utils/response.util.js';

const CommitController = {
    async getCommitsGroupedByRepo(req, res) {
        const data = await CommitService.getCommitsGroupedByRepo();
        return successResponse(res, data, "Lấy danh sách commits thành công");
    }
};

export default CommitController;
