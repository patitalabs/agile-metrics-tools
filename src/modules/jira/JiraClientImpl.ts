import { JiraClient } from './Types';
import * as axios from 'axios';
import * as https from 'https';
import * as http from 'http';

const httpsAgent = new https.Agent({ keepAlive: true });
const httpAgent = new http.Agent({ keepAlive: true });

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

    const response = await axios.default.get(fullUrl, {
      headers: { 'Content-Type': 'application/json', Authorization: authToken },
      httpsAgent,
      httpAgent,
    });
    const json = response.data;
    if (json.errors) {
      throw new Error(...json.errors);
    }
    return json;
  }
}
