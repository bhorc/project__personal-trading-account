import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import YAML from 'yamljs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const swaggerDefinition = YAML.load(join(__dirname, '../schema/openapi.yaml'));
const specs = swaggerJsdoc({
    swaggerDefinition,
    apis: [
        join(__dirname, '../routes/*.mjs'),
        join(__dirname, '../models/*.mjs'),
    ],
});
const swaggerRouter = express.Router();
swaggerRouter.use('/', swaggerUi.serve, swaggerUi.setup(specs));

export default swaggerRouter;