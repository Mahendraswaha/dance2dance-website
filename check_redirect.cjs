const https = require('https');

https.get('https://dance2dance.no', (res) => {
  console.log('dance2dance.no status:', res.statusCode);
  console.log('dance2dance.no location:', res.headers.location);
}).on('error', (e) => {
  console.error(e);
});

https.get('https://www.dance2dance.no', (res) => {
  console.log('www.dance2dance.no status:', res.statusCode);
  console.log('www.dance2dance.no location:', res.headers.location);
}).on('error', (e) => {
  console.error(e);
});
