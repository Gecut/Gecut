import {html} from '@alwatr/element';

import './pages/page-home';
import './pages/page-sign-up';
import './pages/page-sign-in';
import './pages/page-sign-up-details';
import './pages/page-user';
import './pages/page-sans-list';
import './pages/page-support';
import './pages/page-group';
import './pages/admin/page-user-list';
import './pages/admin/page-sans-list';
import './components/color-palette';

import type {RoutesConfig} from '@alwatr/router';

const routes: RoutesConfig['templates'] = {
  'home': () => html`<page-home></page-home>`,
  'user': () => html`<page-user></page-user>`,
  'group': () => html`<page-group></page-group>`,
  'support': () => html`<page-support></page-support>`,
  'sans-list': () => html`<page-sans-list></page-sans-list>`,
  'sign-up': () => html`<page-sign-up></page-sign-up>`,
  'sign-in': () => html`<page-sign-in></page-sign-in>`,
  'sign-up-details': () => html`<page-sign-up-details></page-sign-up-details>`,
  '_404': () => html`<color-palette></color-palette>`,

  'admin-user-list': () => html`<page-admin-user-list></page-admin-user-list>`,
  'admin-sans-list': () => html`<page-admin-sans-list></page-admin-sans-list>`,
};

export default routes;
