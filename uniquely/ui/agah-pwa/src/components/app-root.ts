import {
  AlwatrSmartElement,
  customElement,
  html,
  css,
  cache,
  state,
} from '@alwatr/element';
import {router} from '@alwatr/router';

import '@gecut/ui-kit/icon/icon.js';
import '@gecut/ui-kit/styles/token.css';
import '@gecut/ui-kit/styles/pwa.css';
import '@gecut/ui-kit/styles/mobile-only.css';
import '@gecut/ui-kit/styles/theme/palette-dynamic.css';
import '@gecut/ui-kit/styles/theme/color.css';
import '@alwatr/font/vazirmatn.css';

import routes from '../routes.js';
import '../styles/palette.css';

import type {RoutesConfig} from '@alwatr/router';
import type {PropertyValues} from '@alwatr/element';
import type {LitRenderType} from '../types/lit-render.js';

@customElement('app-root')
export class AppRoot extends AlwatrSmartElement {
  constructor() {
    super();

    router.signal.addListener((route) => {
      this._logger.logMethodArgs('routeChanged', {route});
      this.activePage = route.sectionList[0]?.toString() ?? this.activePage;
    });
    router.initial();
  }

  static override styles = css`
    :host {
      position: relative;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .page-container {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }
  `;

  @state()
  private activePage = 'home';

  private routes: RoutesConfig = {
    map: (route) => route.sectionList[0]?.toString() ?? this.activePage,
    list: routes,
  };

  override render(): LitRenderType {
    return html`
      <div class="page-container">${cache(router.outlet(this.routes))}</div>
    `;
  }

  override firstUpdated(changedProperties: PropertyValues<this>): void {
    super.firstUpdated(changedProperties);

    requestAnimationFrame(() => {
      document.documentElement.removeAttribute('unresolved');
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-root': AppRoot;
  }
}
