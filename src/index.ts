import settings from './appConfig/settings';
import { createServer } from './server';

const app = createServer();
app.listen(settings.port, () => console.log(`Server running on port ${settings.port}`));
