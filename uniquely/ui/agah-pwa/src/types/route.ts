import type {Route as alwatrRoute} from '@alwatr/router';
import type {LitRenderType} from './lit-render.js';

export type Route = {
  render: (route: alwatrRoute) => LitRenderType;
};
export type Routes = Record<string, Readonly<Route>>;
