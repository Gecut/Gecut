import {nanoServer} from '../libs/nano-server.js';

nanoServer.route('GET', '/', () => ({
  ok: true,
  data: {
    app: '⚞ Gecut Agah Api ⚟',
    message: 'Hello ;)',
  },
}));
