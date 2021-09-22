const express = require('express');
const path    = require('path');
const proxy   = require('http-proxy-middleware');

const app = express();

//const NOME_APP_DEPLOY = process.env.NOME_APP_DEPLOY;
//const URL_API         = `${process.env.PROXY_TARGET_DOMAIN}`;
const URL_API         = `http://${process.env.PROXY_TARGET_DOMAIN}`;
const URL_FRONTEND    = `${process.env.URL_FRONT}/api`;

const PROXY_CONFIG = {
  target: URL_API,
  changeOrigin: true,
  secure: false,
  pathRewrite: {
    '^/api': ''
  },
  router: {
    URL_FRONTEND : URL_API
  }
};

console.log(`Usando o endereço ${URL_API} para o proxy...\n`);
const apiProxy = proxy('/api', PROXY_CONFIG);
app.use(apiProxy)

/*
app.use(express.static(`./dist`));
app.all('/*', function(req,res) {
  res.sendFile(path.join(__dirname,`/dist/index.html`));
});
app.listen(process.env.PORT || 8080);
*/


const forceSSL = function() {
    return function (req, res, next) {
      if (req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(
         ['https://', req.get('Host'), req.url].join('')
        );
      }
      next();
    }
}
app.use(forceSSL());


app.use(express.static(`./dist`));
app.all('/*', function(req,res) {
  res.sendFile(path.join(__dirname,`/dist/index.html`));
});
app.listen(process.env.PORT || 8080);


