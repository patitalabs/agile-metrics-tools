import app from './app';
import { Logger } from '../metrics/Logger';

const server = app.listen(app.get('port'), () => {
  Logger.info(
    '  App is running at http://localhost:%d in %s mode',
    app.get('port'),
    app.get('env')
  );
  Logger.info('  Press CTRL-C to stop\n');
});

export default server;
