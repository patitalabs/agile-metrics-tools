import { AppFactory } from './AppFactory';
import { AppContext } from './Types';
import { Logger } from './metrics/Logger';

async function main(fileConfigPath: string): Promise<void> {
  const context: AppContext = await AppFactory.appContextFrom(fileConfigPath);
  const metricsService = AppFactory.metricsService(context);
  await metricsService.start({
    collectorConfigs: context.collectorConfigs,
  });
}

function printUsage() {
  Logger.info(`Usage: node index.js your-app-config.json`);
}

if (process.argv.length < 2) {
  printUsage();
  throw Error('No config specified:');
}
const configFilePath = process.argv[2];
main(configFilePath).then(() => Logger.info('Finished!'));
