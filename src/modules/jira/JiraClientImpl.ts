import * as fetch from 'node-fetch';
import { JiraClient } from './Types';

export class JiraClientImpl implements JiraClient {
  private readonly host: string;
  private readonly apiToken: string;

  constructor({ host, apiToken }) {
    this.host = host;
    this.apiToken = apiToken;
  }

  async getData(url: string): Promise<any> {
    const fullUrl = `${this.host}${url}`;
    const authToken = `Basic ${this.apiToken}`;

    const config = {
      method: 'get',
      headers: { 'Content-Type': 'application/json', Authorization: authToken }
    };
    const response = await fetch(fullUrl, config);

    const json = await response.json();
    if (json.errors) {
      throw new Error(...json.errors);
    }
    return json;
  }
}
