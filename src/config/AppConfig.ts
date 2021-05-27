function checkEnvVar(...theVariables: string[]): void {
  theVariables.forEach((theVariable) => {
    if (!process.env[theVariable]) {
      throw Error(`env.${theVariable} not set!`);
    }
  });
}

export class AppConfig {
  static port(): number {
    return (process.env.PORT || 3000) as number;
  }

  static isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }

  static esHost(): string {
    checkEnvVar('ES_HOST');
    return process.env.ES_HOST;
  }
}
