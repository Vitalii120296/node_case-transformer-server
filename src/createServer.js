const http = require('http');
const { convertToCase } = require('./convertToCase/convertToCase');

function createServer() {
  const server = http.createServer((req, res) => {
    const normalizeUrl = new URL(req.url, 'http://localhost:5700');
    const text = normalizeUrl.pathname.slice(1);
    const caseName = normalizeUrl.searchParams.get('toCase');
    const allowedCases = ['SNAKE', 'KEBAB', 'CAMEL', 'PASCAL', 'UPPER'];

    if (!text || !caseName || !allowedCases.includes(caseName)) {
      res.statusCode = 400;
      res.statusMessage = 'Bad request';
      res.setHeader('Content-Type', 'application/json');

      const error = { errors: [] };

      if (!text) {
        error.errors.push({
          message: `Text to convert is required. Correct request is: "/<TEXT_TO_CONVERT>?toCase=<CASE_NAME>".`,
        });
      }

      if (!caseName) {
        error.errors.push({
          message: `"toCase" query param is required. Correct request is: "/<TEXT_TO_CONVERT>?toCase=<CASE_NAME>".`,
        });
      }

      if (!allowedCases.includes(caseName) && caseName) {
        error.errors.push({
          message: `This case is not supported. Available cases: SNAKE, KEBAB, CAMEL, PASCAL, UPPER.`,
        });
      }

      res.end(JSON.stringify(error));

      return;
    }

    const { originalCase, convertedText } = convertToCase(caseName, text);

    res.statusCode = 200;
    res.statusMessage = 'OK';
    res.setHeader('Content-Type', 'application/json');

    res.end(
      JSON.stringify({
        originalCase,
        targetCase: caseName,
        originalText: text,
        convertedText,
      }),
    );
  });

  return server;
}

module.exports = {
  createServer,
};
