import {html} from '@alwatr/element';

import './pages/page-home';
import './pages/page-sign-up';
import './pages/page-sign-up-details';
import './components/color-palette';

import type {Routes} from './types/route.js';

const routes: Routes = {
  'home': {
    icon: null,
    render: () => html`<page-home></page-home>`,
  },
  'sign-up': {
    icon: null,
    render: () => html`<page-sign-up></page-sign-up>`,
  },
  'sign-up-details': {
    icon: null,
    render: () => html`<page-sign-up-details></page-sign-up-details>`,
  },
  'colors': {
    icon: null,
    render: () => html`<color-palette></color-palette>`,
  },
};

export default routes;
