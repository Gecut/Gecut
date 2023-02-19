import {AlwatrSmartElement, customElement, html, css} from '@alwatr/element';
import {routeContextConsumer, routerOutlet} from '@alwatr/router';

import routes from '../routes.js';

import '../context';
import '../director/index';
import '../styles/index.css';

import type {PropertyValues} from '@alwatr/element';
import type {RoutesConfig} from '@alwatr/router';
import type {LitRenderType} from '../types/lit-render.js';

@customElement('app-root')
export class AppRoot extends AlwatrSmartElement {
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
      flex: 0 1 100%;
      height: 100%;
    }
  `;

  private routes: RoutesConfig = {
    routeId: (route) => route.sectionList[0]?.toString(),
    templates: routes,
  };

  override connectedCallback(): void {
    super.connectedCallback();

    this._signalListenerList.push(
      routeContextConsumer.subscribe(this._routeChanged.bind(this)),
    );
  }

  override render(): LitRenderType {
    return html`
      <div class="page-container">${routerOutlet(this.routes)}</div>
    `;
  }

  override firstUpdated(changedProperties: PropertyValues<this>): void {
    super.firstUpdated(changedProperties);

    requestAnimationFrame(() => {
      document.documentElement.removeAttribute('unresolved');
    });
  }

  private _routeChanged(): void {
    this._logger.logMethod('routeChanged');
    this.requestUpdate();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-root': AppRoot;
  }
}
