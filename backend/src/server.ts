import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import routes from './routes';
import { globalErrorHandler } from './middlewares/errorHandler';
import logger from './utils/logger';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/health', (_req, res) => res.json({ success: true, message: 'OK', timestamp: new Date().toISOString() }));
app.use('/api', routes);

app.use(globalErrorHandler);

const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`API docs available at http://localhost:${PORT}/api-docs`);
});

export default app;
