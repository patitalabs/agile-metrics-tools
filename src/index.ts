import { AppFactory } from './AppFactory';
import { AppContext } from './Types';

async function main(fileConfigPath: string): Promise<void> {
  const context: AppContext = await AppFactory.appContextFrom(fileConfigPath);
  const metricsService = AppFactory.metricsService(context);
  await metricsService.start({
    collectorConfigs: context.collectorConfigs
  });
}

function printUsage() {
  console.log(`Usage: node index.js your-app-config.json`);
}

if (process.argv.length < 2) {
  printUsage();
  throw Error('No config specified:');
}
const configFilePath = process.argv[2];
main(configFilePath).then(() => console.log('Finished!'));
