import { Request, Response } from 'express';
import { AppContextFactory } from '../AppContextFactory';
import { AppFactory } from '../AppFactory';

export class MetricsController {
  static postMetrics = async (req: Request, res: Response) => {
    await MetricsController.handleRequest(req, res);
  };

  static updateMetrics = async (req: Request, res: Response) => {
    await MetricsController.handleRequest(req, res);
  };

  private static async handleRequest(req: Request, res: Response) {
    try {
      const serviceName = req.params.serviceName;
      const shouldUpdateEntries = req.method === 'PUT';
      this.collectMetrics(serviceName, req.body, shouldUpdateEntries).then(() =>
        console.log('Done!')
      );

      res.json({ status: 'Started Collecting metrics....' });
    } catch (error) {
      console.error(error);
      res.json({ error: 'Could not process request' });
    }
  }

  private static async collectMetrics(
    serviceName: string,
    config: any,
    shouldUpdateEntries: boolean
  ) {
    const appContext = AppContextFactory.appContextForService(
      serviceName,
      config
    );

    const metricsService = AppFactory.metricsService(
      appContext,
      shouldUpdateEntries
    );
    return metricsService.start({
      collectorConfigs: appContext.collectorConfigs
    });
  }
}
