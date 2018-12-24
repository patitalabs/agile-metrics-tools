import * as fetch from "node-fetch";
import { toBase64 } from "../../metrics/Utils";
import { JenkinsClient } from "./Types";

export class JenkinsClientImpl implements JenkinsClient {
  private readonly host: String;
  private readonly apiToken: String;
  private readonly apiUser: String;

  constructor({ host, apiToken, apiUser }) {
    this.apiUser = apiUser;
    this.host = host;
    this.apiToken = apiToken;
  }

  async getData(url): Promise<any> {
    const fullUrl = `${this.host}/${url}/api/json?token=${this.apiToken}`;
    const authToken = toBase64(`${this.apiUser}:${this.apiToken}`);

    const config = {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authToken}`
      }
    };

    const response = await fetch(fullUrl, config);
    return response.json();
  }
}
