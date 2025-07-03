const { execSync } = require('child_process');

// Build the frontend
console.log('Building frontend...');
execSync('npm run build', { stdio: 'inherit' });

// Create a simple note about WebSocket limitations
console.log('\nNote: WebSocket features (real-time chat, voice/video calls) are not available on Vercel.');
console.log('The app will work for basic messaging but without real-time updates.');
console.log('For full functionality, deploy to a platform that supports WebSockets.');