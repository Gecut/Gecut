import {html} from '@alwatr/element';

import './pages/page-home';
import './components/color-palette';

import type {Routes} from './types/route.js';

const routes: Routes = {
  home: {
    icon: 'home',
    render: () => html`<page-home></page-home>`,
  },
  colors: {
    icon: 'color',
    render: () => html`<color-palette></color-palette>`,
  },
};

export default routes;
