import prisma from '../config/database.config.js';

const CommitRepository = {
    async getAllCommits() {
        return await prisma.commits.findMany({
            select: {
                repo_full_name: true,
                commit_sha: true,
                created_at: true,
            },
            orderBy: {
                created_at: 'desc',
            },
        }
        );
    },
}

export default CommitRepository;