import * as fetch from 'node-fetch';
import { SonarClient } from './Types';

export class SonarClientImpl implements SonarClient {
  private readonly host: string;
  constructor({ host }) {
    this.host = host;
  }

  async getData(url: string): Promise<any> {
    const fullUrl = `${this.host}${url}`;

    const config = {
      method: 'get',
      headers: { 'Content-Type': 'application/json' },
    };
    const data = await fetch(fullUrl, config);
    return data.json();
  }
}
