import type {nothing, TemplateResult} from '@alwatr/element';

export type LitRenderType =
  | TemplateResult<1>
  | typeof nothing
  | Array<TemplateResult<1>>;
