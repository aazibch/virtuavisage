require('dotenv').config();
let clientUrl = 'http://localhost:5173';

if (process.env.NODE_ENV === 'production') {
  clientUrl = '';
}

let apiUrl = 'http://localhost:8080';

if (process.env.NODE_ENV === 'production') {
  apiUrl = '';
}

module.exports = { clientUrl, apiUrl };
