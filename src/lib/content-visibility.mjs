/** @param {{draft?: boolean, development?: boolean, previewDrafts?: string}} options */
export function isDraftVisible({ draft, development, previewDrafts } = {}) {
  return !draft || (development === true && previewDrafts === "true");
}
