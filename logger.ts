import { NestExpressApplication } from '@nestjs/platform-express';
const morgan = require('morgan');
export function useLogger(app: NestExpressApplication) {
  app.use(
    morgan(':method :url :response-time', {
      skip: function (req, res) {
        return req.url === '/' || res.statusCode === 404;
      },
    }),
  );
}
