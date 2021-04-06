import { Request, Response } from 'express';
import { ApiMetricsService } from './ApiMetricsService';
import {
  TeamMetricsRequest,
  TeamMetricsRequestByService,
  TeamMetricsRequestByTeam,
} from '../Types';
import { Logger } from '../metrics/Logger';

export class MetricsController {
  static postMetrics = async (req: Request, res: Response) => {
    await MetricsController.handleRequest(req, res);
  };

  static updateMetrics = async (req: Request, res: Response) => {
    await MetricsController.handleRequest(req, res);
  };

  private static async handleRequest(req: Request, res: Response) {
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
    return ApiMetricsService.metricsForRequest(teamMetricRequest);
  }

  private static createRequest(req: Request): TeamMetricsRequest {
    const body = req.body as any;
    const serviceName = body.serviceName || null;
    const teamName = body.teamName || null;
    const config = body.config || null;
    const method = req.method;
    const startDate = body.startDate || null;
    const endDate = body.endDate || null;

    const shouldUpdateEntries = method === 'PUT';

    let teamMetricRequest:
      | TeamMetricsRequestByTeam
      | TeamMetricsRequestByService;
    if (teamName) {
      teamMetricRequest = {
        teamName,
        shouldUpdateEntries,
        since: startDate,
        until: endDate,
      };
    } else {
      teamMetricRequest = {
        serviceName,
        config,
        shouldUpdateEntries,
      };
    }
    return teamMetricRequest;
  }
}
