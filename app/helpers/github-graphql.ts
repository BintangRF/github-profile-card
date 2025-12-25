export async function fetchGitHubStats(username: string) {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query ($login: String!) {
          user(login: $login) {
            repositories(first: 100, privacy: PUBLIC) {
              nodes { stargazerCount forkCount }
            }
            contributionsCollection {
              totalCommitContributions
              totalPullRequestContributions
              totalIssueContributions
              contributionCalendar { totalContributions }
            }
            pullRequests(states: MERGED) {
              totalCount
            }
          }
        }
      `,
      variables: { login: username },
    }),
  });

  if (!res.ok) throw new Error("GitHub GraphQL error");
  return (await res.json()).data.user;
}
