// Función serverless de Vercel: trae el CSV publicado de Google Sheets
// del lado del servidor (sin problemas de CORS ni proxies de terceros).
module.exports = async function handler(req, res) {
  const SHEETS = {
    disco: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRSq9O2tPGd3sBaMwvNbroBNVmK9wRagXypMiqEJFoPQPV28vA7d7m0vs4T-ZU6VYjNF417Y8VwNEVz/pub?gid=0&single=true&output=csv',
    track: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRSq9O2tPGd3sBaMwvNbroBNVmK9wRagXypMiqEJFoPQPV28vA7d7m0vs4T-ZU6VYjNF417Y8VwNEVz/pub?gid=1908540884&single=true&output=csv'
  };
  const url = SHEETS[req.query.which];
  if (!url) {
    res.status(400).send('Parámetro "which" debe ser "disco" o "track"');
    return;
  }
  try {
    const r = await fetch(url);
    const text = await r.text();
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300');
    res.status(200).send(text);
  } catch (e) {
    res.status(502).send('');
  }
}
