import { formatJSONNumbers } from "../helpers/format-number";
import { svgStyle } from "./style";

export function buildSVG({
  user,
  rows,
  avatarBase64,
}: {
  user: any;
  rows: string;
  avatarBase64: string | null;
}) {
  return `
<svg
  width="780"
  height="260"
  viewBox="0 0 780 260"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
>
  <defs>
    <linearGradient id="darkBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#44475A"/>
      <stop offset="50%" stop-color="#6272A4"/>
      <stop offset="100%" stop-color="#44475A"/>
    </linearGradient>
    <clipPath id="avatarClip">
      <circle cx="110" cy="75" r="44"/>
    </clipPath>
  </defs>

  ${svgStyle}

  <rect x="1.5" y="1.5" width="777" height="257" rx="18"
    fill="none" stroke="url(#darkBorder)" stroke-width="2"/>

  <rect x="6" y="6" width="768" height="248" rx="14"
    fill="#282A36" stroke="#44475A"/>

  <circle cx="110" cy="75" r="48" fill="#44475A" stroke="#6272A4" stroke-width="2"/>

  ${
    avatarBase64
      ? `<image
            xlink:href="${avatarBase64}"
            x="66"
            y="31"
            width="88"
            height="88"
            clip-path="url(#avatarClip)"
            preserveAspectRatio="xMidYMid slice"
          />`
      : ""
  }

  <text x="180" y="48" class="title">My GitHub Stats</text>
  <text x="180" y="76" class="username">@${user.login}</text>
  <text x="180" y="100" class="sub muted">
    ${formatJSONNumbers(user.followers)} Followers · ${formatJSONNumbers(
    user.following
  )} Following
  </text>

  <line x1="380" y1="32" x2="380" y2="228" stroke="#44475A"/>

  <g transform="translate(410, 25)">
    ${rows}
  </g>
</svg>`;
}
