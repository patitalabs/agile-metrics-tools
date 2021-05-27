import { Request, Response } from 'express';
import { TeamMetricsRequest } from '../domain/Types';
import { Logger } from '../domain/metrics/Logger';
import { appContext } from '../config/AppContext';

export class MetricsController {
  static postMetrics = (req: Request, res: Response): void => {
    (async (): Promise<any> => {
      await MetricsController.handleRequest(req, res);
    })();
  };

  static updateMetrics = (req: Request, res: Response): void => {
    (async (): Promise<any> => {
      await MetricsController.handleRequest(req, res);
    })();
  };

  static postMetricsEntries = (req: Request, res: Response): void => {
    (async (): Promise<any> => {
      await MetricsController.handleEntriesRequest(req, res);
    })();
  };

  static updateMetricsEntries = (req: Request, res: Response): void => {
    (async (): Promise<any> => {
      await MetricsController.handleEntriesRequest(req, res);
    })();
  };

  private static async handleEntriesRequest(
    req: Request,
    res: Response
  ): Promise<any> {
    const body = req.body;
    const entries = body.entries || [];
    const shouldUpdateEntries = req.method === 'PUT';

    try {
      const pushPromises = entries.map((metricItem) =>
        appContext.apiMetricsService.pushMetrics(
          metricItem,
          shouldUpdateEntries
        )
      );
      res.json({ status: 'Done!.' });
      await Promise.all(pushPromises);
    } catch (error) {
      Logger.error(error);
      res.json({ error: 'Could not process request' });
    }
  }

  private static async handleRequest(
    req: Request,
    res: Response
  ): Promise<any> {
    try {
      await this.collectMetrics(req);
      res.json({ status: 'Done!.' });
      Logger.info('Done!');
    } catch (error) {
      Logger.error(error);
      res.json({ error: 'Could not process request' });
    }
  }

  private static async collectMetrics(req: Request): Promise<void> {
    const teamMetricRequest = this.createRequest(req);
    return appContext.apiMetricsService.metricsForRequest(teamMetricRequest);
  }

  private static createRequest(req: Request): TeamMetricsRequest {
    const body = req.body;
    const method = req.method;
    const since = body.since || null;
    const until = body.until || null;
    const config = body.config || null;

    const shouldUpdateEntries = method === 'PUT';

    return {
      shouldUpdateEntries,
      since,
      until,
      config,
    };
  }
}
