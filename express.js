const express = require('express'); // eslint-disable-line
const browserCapabilities = require('browser-capabilities'); // eslint-disable-line
const compression = require('compression'); // eslint-disable-line

const app = express();
const basedir = __dirname + '/src/'; // eslint-disable-line
app.use(compression());

function getSourcesPath(request) {
  let clientCapabilities = browserCapabilities.browserCapabilities(
    request.headers['user-agent']);

  clientCapabilities = new Set(clientCapabilities); // eslint-disable-line
  if (clientCapabilities.has('modules')) {
    return basedir;
  } else {
    return basedir;
  }
}

app.use('/template/', (req, res, next) => {
  express.static(getSourcesPath(req))(req, res, next);
});

app.get(/.*service-worker\.js/, function (req, res) {
  res.sendFile(getSourcesPath(req) + 'service-worker.js');
});

app.get(/.*manifest\.json/, function (req, res) {
  res.sendFile(getSourcesPath(req) + 'manifest.json');
});


app.use((req, res) => {
  // handles app access using a different state path than index (otherwise it will not return any file)
  res.sendFile(getSourcesPath(req) + 'index.html');
});

app.listen(8080);
