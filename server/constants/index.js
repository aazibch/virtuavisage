require('dotenv').config();
let clientUrl = 'http://localhost:5173';

if (process.env.NODE_ENV === 'production') {
  clientUrl = 'https://virtuavisage.onrender.com';
}

let apiUrl = 'http://localhost:8080';

if (process.env.NODE_ENV === 'production') {
  apiUrl = 'https://virtuavisage-api.onrender.com';
}

module.exports = { clientUrl, apiUrl };
