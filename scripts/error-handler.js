// error-handler.js - Global error handling for loader issues
window.onerror = function(message, source, lineno, colno, error) {
    console.error('Global error caught:', error);
    // Don't expose internal errors to users in production
};

window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    // Don't expose internal errors to users in production
});