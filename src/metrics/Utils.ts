import * as crypto from "crypto";

export function toBase64(theText: string): string {
  return Buffer.from(theText).toString("base64");
}

const INIT_VECTOR = "someSecret";

export function toHash(theText: string): string {
  return crypto
    .createHmac("sha256", INIT_VECTOR)
    .update(theText)
    .digest("hex");
}

export function concat(x: [], y: []) {
  return x.concat(y);
}

export function flatMap(func, arr) {
  return arr.map(func).reduce(concat, []);
}

export function checkEnvVar(...theVariables: string[]) {
  theVariables.forEach(theVariable => {
    if (!process.env[theVariable]) {
      throw Error(`env.${theVariable} not set!`);
    }
  });
}
