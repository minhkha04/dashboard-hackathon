import CommitRepository from '../repositories/commit.repository.js';

const CommitService = {
    async getCommitsGroupedByRepo() {
        const commits = await CommitRepository.getAllCommits();

        // Gom nhóm theo repo_full_name
        const grouped = commits.reduce((acc, commit) => {
            const repo = commit.repo_full_name;
            if (!acc[repo]) {
                acc[repo] = {
                    repo_full_name: repo,
                    total_commits: 0,
                    commits: [],
                };
            }
            acc[repo].total_commits += 1;
            acc[repo].commits.push({
                commit_sha: commit.commit_sha,
                created_at: commit.created_at,
            });
            return acc;
        }, {});

        // Trả ra thành array
        return Object.values(grouped);
    },
};

export default CommitService;