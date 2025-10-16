export const logEvent = (name, params = {}) => {
  console.log(`[analytics] ${name}`, params);
};
