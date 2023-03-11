import {nanoServer} from '../libraries/nano-server.js';

nanoServer.route('GET', '/', () => ({
  ok: true,
  data: {
    app: '⚞ Gecut agaah Api ⚟',
    message: 'Hello ;)',
  },
}));
