// Copy of ai_trainer.js but with 1095 days (3 years) instead of 365
// This will test if prestige is achievable with more time

const fs = require('fs');
const aiTrainerCode = fs.readFileSync('./ai_trainer.js', 'utf8');
const longVersion = aiTrainerCode.replace('const DAYS_PER_RUN = 365', 'const DAYS_PER_RUN = 1095');
eval(longVersion);
