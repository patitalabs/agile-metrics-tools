import fetch from 'node-fetch';
import { Utils } from '../../metrics';
import { JenkinsClient } from './Types';

export class JenkinsClientImpl implements JenkinsClient {
  private readonly host: string;
  private readonly apiToken: string;
  private readonly apiUser: string;

  constructor({ host, apiToken, apiUser }) {
    this.apiUser = apiUser;
    this.host = host;
    this.apiToken = apiToken;
  }

  async getData(url): Promise<any> {
    const fullUrl = `${this.host}/${url}/api/json?token=${this.apiToken}`;
    const authToken = Utils.toBase64(`${this.apiUser}:${this.apiToken}`);

    const config = {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${authToken}`,
      },
    };

    const response = await fetch(fullUrl, config);
    return response.json();
  }
}
