export function statRow(y: number, icon: string, label: string, value: number) {
  return `
  <g transform="translate(0, ${y})">
    ${icon}
    <text x="26" y="14" class="label">${label}:</text>
    <text x="210" y="14" class="value">${value}</text>
  </g>`;
}
