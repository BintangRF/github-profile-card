import { iconBaseDark } from "./base";

export const repoIcon = () =>
  `<svg ${iconBaseDark}><path d="M3 4h18v16H3z"/><path d="M3 9h18"/></svg>`;

export const starIcon = () =>
  `<svg ${iconBaseDark}><polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9"/></svg>`;

export const forkIcon = () =>
  `<svg ${iconBaseDark}><circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="M6 9v6a3 3 0 0 0 3 3h6"/></svg>`;

export const commitIcon = () =>
  `<svg ${iconBaseDark}><circle cx="12" cy="12" r="4"/><path d="M12 2v6M12 16v6"/></svg>`;

export const prIcon = () =>
  `<svg ${iconBaseDark}><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><path d="M6 9v6a6 6 0 0 0 12 0V9"/></svg>`;

export const mergeIcon = () =>
  `<svg ${iconBaseDark}><path d="M18 6a3 3 0 1 0-3-3"/><path d="M6 18a3 3 0 1 0 3 3"/><path d="M6 9v6a6 6 0 0 0 12 0"/></svg>`;

export const issueIcon = () =>
  `<svg ${iconBaseDark}><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg>`;

export const contribIcon = () =>
  `<svg ${iconBaseDark}><path d="M12 20v-6"/><path d="M6 20V10"/><path d="M18 20V4"/></svg>`;
