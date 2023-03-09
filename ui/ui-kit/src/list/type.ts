// https://m3.material.io/components/lists/guidelines#30e9b982-6d57-4163-8514-83761650db9f

export type ItemData = {
  headline: string;

  supportingText?: string;
  href?: string;

  leading?:
    | ItemDataIconLeading
    | ItemDataAvatarContainerLeading
    | ItemDataAvatarLabelTextLeading
    | ItemDataMediaImageLeading;

  trailing?:
    | ItemDataTextTrailing
    | ItemDataIconTrailing
    | ItemDataIconButtonTrailing
    | ItemDataCheckboxTrailing
    | ItemDataRadioTrailing;
};

/* start of define leading types */
type ItemDataIconLeading = {
  type: 'icon';
  icon: string;
};

type ItemDataAvatarContainerLeading = {
  type: 'avatar';
  source: string;
};
type ItemDataAvatarLabelTextLeading = {
  type: 'avatar-text';
  text: string;
};

type ItemDataMediaImageLeading = {
  type: 'media';
  source: string;
};
/* end of define leading types */

/* start of define trailing types */
type ItemDataTextTrailing = {
  type: 'text';
  text: string;
};

type ItemDataIconTrailing = {
  type: 'icon';
  icon: string;
};
type ItemDataIconButtonTrailing = {
  // TODO: icon button trailing
  type: 'icon-button';
};

type ItemDataCheckboxTrailing = {
  // TODO: checkbox trailing
  type: 'checkbox';
};

type ItemDataRadioTrailing = {
  // TODO: radio trailing
  type: 'radio';
};
/* end of define trailing types */
