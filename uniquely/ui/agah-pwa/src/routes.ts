import {html} from '@alwatr/element';

import './pages/page-home';
import './pages/page-sign-up';
import './pages/page-sign-up-details';
import './pages/page-user';
import './pages/page-sans-list';
import './pages/page-support';
import './components/color-palette';

import type {Routes} from './types/route.js';

const routes: Routes = {
  'home': {
    render: () => html`<page-home></page-home>`,
  },
  'user': {
    render: () => html`<page-user></page-user>`,
  },
  'support': {
    render: () => html`<page-support></page-support>`,
  },
  'sans-list': {
    render: () => html`<page-sans-list></page-sans-list>`,
  },
  'sign-up': {
    render: () => html`<page-sign-up></page-sign-up>`,
  },
  'sign-up-details': {
    render: () => html`<page-sign-up-details></page-sign-up-details>`,
  },
  'colors': {
    render: () => html`<color-palette></color-palette>`,
  },
};

export default routes;
