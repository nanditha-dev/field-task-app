export const logEvent = (name, params = {}) => {
  // Simple console-based analytics for the exercise
  // Example: logEvent('screen_view', { screen: 'TaskList' });
  // Replace with a real analytics SDK as needed.
  // eslint-disable-next-line no-console
  console.log(`[analytics] ${name}`, params);
};