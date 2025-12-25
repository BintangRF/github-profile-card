export async function fetchGitHubUser(username: string) {
  const res = await fetch(`https://api.github.com/users/${username}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
  });

  if (!res.ok) throw new Error("GitHub user not found");
  return res.json();
}
