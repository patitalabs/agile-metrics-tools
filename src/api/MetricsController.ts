import { Request, Response } from 'express';
import { AppContextFactory } from '../AppContextFactory';
import { AppFactory } from '../AppFactory';

export class MetricsController {
  static metricsForService = async (req: Request, res: Response) => {
    try {
      const serviceName = req.params.serviceName;
      const appContext = await AppContextFactory.appContextForService(
        serviceName,
        req.body
      );
      const metricsService = AppFactory.metricsService(appContext);
      metricsService
        .start({
          collectorConfigs: appContext.collectorConfigs
        })
        .then(() => console.log('Done!'));

      res.json({ status: 'Started Collecting metrics....' });
    } catch (error) {
      console.error(error);
      res.json({ error: 'Could not process request' });
    }
  };
}
