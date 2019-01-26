import express = require('express');
import { MetricsController } from './MetricsController';

const app = express();
app.disable('x-powered-by');
app.use(express.json());

app.post('/metrics/:serviceName', MetricsController.postMetrics);
app.put('/metrics/:serviceName', MetricsController.updateMetrics);

app.set('port', process.env.PORT || 3000);

export default app;
