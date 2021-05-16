import * as express from 'express';
import { MetricsController } from './MetricsController';
import * as path from 'path';

const app = express();
app.disable('x-powered-by');
app.use(express.json());

app.post('/metrics/', MetricsController.postMetrics);
app.put('/metrics/', MetricsController.updateMetrics);

app.post('/metrics/entries/', MetricsController.postMetricsEntries);
app.put('/metrics/entries/', MetricsController.updateMetricsEntries);

app.set('port', process.env.PORT || 3000);

app.use('/', express.static(path.join(__dirname, '../resources')));

app.set('port', process.env.PORT || 3000);

export default app;
