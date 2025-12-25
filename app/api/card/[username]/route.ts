export const runtime = "edge";

/* =======================
   HELPERS
======================= */
async function fetchAvatarBase64(url: string) {
  const res = await fetch(url);
  if (!res.ok) return null;

  const buffer = await res.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return `data:image/png;base64,${btoa(binary)}`;
}

export async function GET(
  _: Request,
  context: { params: Promise<{ username: string }> }
) {
  const { username } = await context.params;

  /* =======================
     REST USER DATA
  ======================= */
  const userRes = await fetch(`https://api.github.com/users/${username}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
  });

  if (!userRes.ok) {
    return new Response("GitHub user not found", { status: 404 });
  }

  const user = await userRes.json();
  const avatarBase64 = await fetchAvatarBase64(user.avatar_url);

  /* =======================
     GRAPHQL STATS
  ======================= */
  const gqlRes = await fetch("https://api.github.com/graphql", {
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
              nodes {
                stargazerCount
                forkCount
              }
            }
            contributionsCollection {
              totalCommitContributions
              totalPullRequestContributions
              totalIssueContributions
              contributionCalendar {
                totalContributions
              }
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

  if (!gqlRes.ok) {
    return new Response("GitHub GraphQL error", { status: 500 });
  }

  const gql = (await gqlRes.json()).data.user;

  const stars = gql.repositories.nodes.reduce(
    (s: number, r: any) => s + r.stargazerCount,
    0
  );
  const forks = gql.repositories.nodes.reduce(
    (s: number, r: any) => s + r.forkCount,
    0
  );

  const commits = gql.contributionsCollection.totalCommitContributions;
  const prs = gql.contributionsCollection.totalPullRequestContributions;
  const mergedPRs = gql.pullRequests.totalCount;
  const issues = gql.contributionsCollection.totalIssueContributions;
  const contributed =
    gql.contributionsCollection.contributionCalendar.totalContributions;

  /* =======================
     SVG
  ======================= */
  const svg = `
<svg width="780" height="260" viewBox="0 0 780 260" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Subtle dark border gradient -->
    <linearGradient id="darkBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#44475A"/>
      <stop offset="50%" stop-color="#6272A4"/>
      <stop offset="100%" stop-color="#44475A"/>
    </linearGradient>

    <clipPath id="avatarClip">
      <circle cx="110" cy="75" r="44"/>
    </clipPath>
  </defs>

  <style>
    .title { font: bold 20px system-ui; fill: #F8F8F2 }
    .username { font: bold 15px system-ui; fill: #BD93F9 }
    .sub { font: 13px system-ui; fill: #F8F8F2 }
    .label { font: 13px system-ui; fill: #BD93F9}
    .value { font: bold 13px system-ui; fill: #F8F8F2 }
    .muted { fill: #6272A4 }
    .icon { stroke: #6272A4 }
  </style>

  <!-- Outer dark border -->
  <rect
    x="1.5"
    y="1.5"
    width="777"
    height="257"
    rx="18"
    fill="none"
    stroke="url(#darkBorder)"
    stroke-width="2"
  />

  <!-- Card body -->
  <rect
    x="6"
    y="6"
    width="768"
    height="248"
    rx="14"
    fill="#282A36"
    stroke="#44475A"
    stroke-width="1"
  />

  <!-- Avatar ring -->
  <circle cx="110" cy="75" r="48" fill="#44475A" stroke="#6272A4" stroke-width="2"/>

  <!-- Avatar image -->
  ${
    avatarBase64
      ? `<image href="${avatarBase64}" x="66" y="31" width="88" height="88" clip-path="url(#avatarClip)"/>`
      : ""
  }

  <!-- Left -->
  <text x="180" y="48" class="title">GitHub Stats</text>
  <text x="180" y="76" class="username">@${user.login}</text>
  <text x="180" y="100" class="sub muted">
    ${user.followers} Followers · ${user.following} Following
  </text>

  <!-- Divider -->
  <line x1="380" y1="32" x2="380" y2="228" stroke="#44475A"/>

  <!-- Right -->
  <g transform="translate(410, 25)">
    ${statRow(0, repoIconDark(), "Total Repositories", user.public_repos)}
    ${statRow(28, starIconDark(), "Stars Count", stars)}
    ${statRow(56, forkIconDark(), "Forks Count", forks)}
    ${statRow(84, commitIconDark(), "Commits Count", commits)}
    ${statRow(112, prIconDark(), "Total PRs", prs)}
    ${statRow(140, mergeIconDark(), "Merged PRs", mergedPRs)}
    ${statRow(168, issueIconDark(), "Total Issues", issues)}
    ${statRow(196, contribIconDark(), "Contributions (Year)", contributed)}
  </g>
</svg>
`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=21600",
    },
  });
}

/* =======================
   ICON HELPERS
======================= */
function statRow(y: number, icon: string, label: string, value: number) {
  return `
  <g transform="translate(0, ${y})">
    ${icon}
    <text x="26" y="14" class="label">${label}:</text>
    <text x="210" y="14" class="value">${value}</text>
  </g>`;
}

const iconBaseDark = `width="16" height="16" viewBox="0 0 24 24"
   fill="none" stroke="#BD93F9"
   stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;

const repoIconDark = () =>
  `<svg ${iconBaseDark}><path d="M3 4h18v16H3z"/><path d="M3 9h18"/></svg>`;

const starIconDark = () =>
  `<svg ${iconBaseDark}><polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9"/></svg>`;

const forkIconDark = () =>
  `<svg ${iconBaseDark}><circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="M6 9v6a3 3 0 0 0 3 3h6"/></svg>`;

const commitIconDark = () =>
  `<svg ${iconBaseDark}><circle cx="12" cy="12" r="4"/><path d="M12 2v6M12 16v6"/></svg>`;

const prIconDark = () =>
  `<svg ${iconBaseDark}><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><path d="M6 9v6a6 6 0 0 0 12 0V9"/></svg>`;

const mergeIconDark = () =>
  `<svg ${iconBaseDark}><path d="M18 6a3 3 0 1 0-3-3"/><path d="M6 18a3 3 0 1 0 3 3"/><path d="M6 9v6a6 6 0 0 0 12 0"/></svg>`;

const issueIconDark = () =>
  `<svg ${iconBaseDark}><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg>`;

const contribIconDark = () =>
  `<svg ${iconBaseDark}><path d="M12 20v-6"/><path d="M6 20V10"/><path d="M18 20V4"/></svg>`;
