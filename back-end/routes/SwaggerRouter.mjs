import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import { serve, setup } from 'swagger-ui-express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
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
swaggerRouter.use('/', serve, setup(specs));

export default swaggerRouter;
