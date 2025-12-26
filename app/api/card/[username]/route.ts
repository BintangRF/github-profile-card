import { fetchAvatarBase64 } from "@/app/helpers/avatar";
import { formatJSONNumbers } from "@/app/helpers/format-number";
import { fetchGitHubStats } from "@/app/helpers/github-graphql";
import { fetchGitHubUser } from "@/app/helpers/github-rest";
import {
  commitIcon,
  contribIcon,
  forkIcon,
  issueIcon,
  mergeIcon,
  prIcon,
  repoIcon,
  starIcon,
} from "@/app/svg/icons";
import { statRow } from "@/app/svg/stat-row";
import { buildSVG } from "@/app/svg/template";

export const runtime = "edge";

export async function GET(
  _: Request,
  context: { params: Promise<{ username: string }> }
) {
  const { username } = await context.params;

  try {
    /* =======================
       FETCH DATA
    ======================= */
    const getUser = await fetchGitHubUser(username);
    const user = formatJSONNumbers(getUser);
    const gql = await fetchGitHubStats(username);
    const avatarBase64 = await fetchAvatarBase64(user.avatar_url);

    /* =======================
       AGGREGATE STATS
    ======================= */
    const stars = formatJSONNumbers(
      gql.repositories.nodes.reduce(
        (sum: number, r: any) => sum + r.stargazerCount,
        0
      )
    );

    const forks = formatJSONNumbers(
      gql.repositories.nodes.reduce(
        (sum: number, r: any) => sum + r.forkCount,
        0
      )
    );

    const commits = formatJSONNumbers(
      gql.contributionsCollection.totalCommitContributions
    );
    const prs = formatJSONNumbers(
      gql.contributionsCollection.totalPullRequestContributions
    );
    const mergedPRs = formatJSONNumbers(gql.pullRequests.totalCount);
    const issues = formatJSONNumbers(
      gql.contributionsCollection.totalIssueContributions
    );
    const contributed = formatJSONNumbers(
      gql.contributionsCollection.contributionCalendar.totalContributions
    );

    /* =======================
       BUILD STAT ROWS
    ======================= */
    const rows = [
      statRow(0, repoIcon(), "Total Repositories", user.public_repos),
      statRow(28, starIcon(), "Stars Count", stars),
      statRow(56, forkIcon(), "Forks Count", forks),
      statRow(84, commitIcon(), "Commits Count", commits),
      statRow(112, prIcon(), "Total PRs", prs),
      statRow(140, mergeIcon(), "Merged PRs", mergedPRs),
      statRow(168, issueIcon(), "Total Issues", issues),
      statRow(196, contribIcon(), "Contributions (Year)", contributed),
    ].join("");

    /* =======================
       BUILD SVG
    ======================= */
    const svg = buildSVG({
      user,
      rows,
      avatarBase64,
    });

    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "public, max-age=21600",
      },
    });
  } catch (e) {
    return new Response("Failed to generate GitHub stats", { status: 500 });
  }
}
