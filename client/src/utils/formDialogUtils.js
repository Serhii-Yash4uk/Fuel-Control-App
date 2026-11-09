export const getLabelWithoutUnits = (label) => {
  const match = label.match(/^(.*?)\s*\(/);
  return match ? match[1] : label;
};
