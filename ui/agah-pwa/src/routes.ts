import {html} from '@alwatr/element';

import './pages/page-home';

import type {Routes} from './types/route.js';

const routes: Routes = {
  home: {
    icon: 'home',
    render: () => html`<page-home></page-home>`,
  },
};

export default routes;
