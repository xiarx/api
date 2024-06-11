import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import router from './router.js';
const server = express();
server.use(compression());
server.use(helmet());
server.disable('x-powered-by');
server.use(express.json({
    inflate: false,
    limit: '100kb',
    strict: true,
    type: 'application/json',
    verify: (request, response, buffer, encoding) => {
        try {
            JSON.parse(buffer.toString());
        }
        catch (error) {
            response.status(400).end('Invalid JSON');
        }
    },
}));
server.use((request, response, next) => {
    if (request.query.url) {
        try {
            if (new URL(request.query.url).host === process.env.HOST) {
                response.redirect(request.query.url);
            }
            else {
                response.status(400).end('Invalid redirect');
            }
        }
        catch (error) {
            response.status(400).end('Invalid URI');
        }
    }
    else {
        next();
    }
});
server.use(router);
server.use((request, response, next) => {
    response.status(404).send('Not found');
});
server.use((error, request, response, next) => {
    console.error(error.stack);
    response.status(500).send('Server error');
});
export default server;
