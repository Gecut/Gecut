import type {Route as alwatrRoute} from '@alwatr/router';
import type {LitRenderType} from './lit-render';

export type Route = {
  icon: string | null;
  render: (route: alwatrRoute) => LitRenderType;
};
export type Routes = Record<string, Readonly<Route>>;
