import {
  customElement,
  html,
  css,
  map,
  AlwatrDummyElement,
} from '@alwatr/element';
import {random} from '@alwatr/math';
import {range} from 'lit/directives/range.js';
import {styleMap} from 'lit/directives/style-map.js';

import eyeLinearIcon from '@gecut/iconsax-cdn/linear/eye?raw';
import peopleLinearIcon from '@gecut/iconsax-cdn/linear/people?raw';
import clockLinearIcon from '@gecut/iconsax-cdn/linear/clock?raw';
import editLinearIcon from '@gecut/iconsax-cdn/linear/edit?raw';
import userSearchLinearIcon from '@gecut/iconsax-cdn/linear/user-search?raw';
import copyLinearIcon from '@gecut/iconsax-cdn/linear/copy?raw';
import callLinearIcon from '@gecut/iconsax-cdn/linear/call-calling?raw';
import userOctagonLinearIcon from '@gecut/iconsax-cdn/linear/user-octagon?raw';
import calendarLinearIcon from '@gecut/iconsax-cdn/linear/calendar?raw';
import messageAddLinearIcon from '@gecut/iconsax-cdn/linear/message-add-1?raw';

import eyeBoldIcon from '@gecut/iconsax-cdn/bold/eye?raw';
import peopleBoldIcon from '@gecut/iconsax-cdn/bold/people?raw';
import clockBoldIcon from '@gecut/iconsax-cdn/bold/clock?raw';
import editBoldIcon from '@gecut/iconsax-cdn/bold/edit?raw';
import userSearchBoldIcon from '@gecut/iconsax-cdn/bold/user-search?raw';
import copyBoldIcon from '@gecut/iconsax-cdn/bold/copy?raw';
import callBoldIcon from '@gecut/iconsax-cdn/bold/call-calling?raw';
import userOctagonBoldIcon from '@gecut/iconsax-cdn/bold/user-octagon?raw';
import calendarBoldIcon from '@gecut/iconsax-cdn/bold/calendar?raw';
import messageAddBoldIcon from '@gecut/iconsax-cdn/bold/message-add-1?raw';

import eyeBrokenIcon from '@gecut/iconsax-cdn/broken/eye?raw';
import peopleBrokenIcon from '@gecut/iconsax-cdn/broken/people?raw';
import clockBrokenIcon from '@gecut/iconsax-cdn/broken/clock?raw';
import editBrokenIcon from '@gecut/iconsax-cdn/broken/edit?raw';
import userSearchBrokenIcon from '@gecut/iconsax-cdn/broken/user-search?raw';
import copyBrokenIcon from '@gecut/iconsax-cdn/broken/copy?raw';
import callBrokenIcon from '@gecut/iconsax-cdn/broken/call-calling?raw';
import userOctagonBrokenIcon from '@gecut/iconsax-cdn/broken/user-octagon?raw';
import calendarBrokenIcon from '@gecut/iconsax-cdn/broken/calendar?raw';
import messageAddBrokenIcon from '@gecut/iconsax-cdn/broken/message-add-1?raw';

import eyeBulkIcon from '@gecut/iconsax-cdn/bulk/eye-slash?raw';
import peopleBulkIcon from '@gecut/iconsax-cdn/bulk/people?raw';
import clockBulkIcon from '@gecut/iconsax-cdn/bulk/clock?raw';
import editBulkIcon from '@gecut/iconsax-cdn/bulk/edit?raw';
import userSearchBulkIcon from '@gecut/iconsax-cdn/bulk/user-search?raw';
import copyBulkIcon from '@gecut/iconsax-cdn/bulk/copy?raw';
import callBulkIcon from '@gecut/iconsax-cdn/bulk/call-calling?raw';
import userOctagonBulkIcon from '@gecut/iconsax-cdn/bulk/user-octagon?raw';
import calendarBulkIcon from '@gecut/iconsax-cdn/bulk/calendar?raw';
import messageAddBulkIcon from '@gecut/iconsax-cdn/bulk/message-add-1?raw';

import eyeOutlineIcon from '@gecut/iconsax-cdn/outline/eye?raw';
import peopleOutlineIcon from '@gecut/iconsax-cdn/outline/people?raw';
import clockOutlineIcon from '@gecut/iconsax-cdn/outline/clock?raw';
import editOutlineIcon from '@gecut/iconsax-cdn/outline/edit?raw';
import userSearchOutlineIcon from '@gecut/iconsax-cdn/outline/user-search?raw';
import copyOutlineIcon from '@gecut/iconsax-cdn/outline/copy?raw';
import callOutlineIcon from '@gecut/iconsax-cdn/outline/call-calling?raw';
import userOctagonOutlineIcon from '@gecut/iconsax-cdn/outline/user-octagon?raw';
import calendarOutlineIcon from '@gecut/iconsax-cdn/outline/calendar?raw';
import messageAddOutlineIcon from '@gecut/iconsax-cdn/outline/message-add-1?raw';

import eyeTwoToneIcon from '@gecut/iconsax-cdn/twotone/eye?raw';
import peopleTwoToneIcon from '@gecut/iconsax-cdn/twotone/people?raw';
import clockTwoToneIcon from '@gecut/iconsax-cdn/twotone/clock?raw';
import editTwoToneIcon from '@gecut/iconsax-cdn/twotone/edit?raw';
import userSearchTwoToneIcon from '@gecut/iconsax-cdn/twotone/user-search?raw';
import copyTwoToneIcon from '@gecut/iconsax-cdn/twotone/copy?raw';
import callTwoToneIcon from '@gecut/iconsax-cdn/twotone/call-calling?raw';
import userOctagonTwoToneIcon from '@gecut/iconsax-cdn/twotone/user-octagon?raw';
import calendarTwoToneIcon from '@gecut/iconsax-cdn/twotone/calendar?raw';
import messageAddTwoToneIcon from '@gecut/iconsax-cdn/twotone/message-add-1?raw';

import '@gecut/ui-kit/icon/icon';

import type {LitRenderType} from '../types/lit-render.js';

@customElement('color-palette')
export class ColorPalette extends AlwatrDummyElement {
  static override styles = css`
    * {
      box-sizing: border-box;
    }

    :host {
      position: relative;
      display: flex;
      height: 100%;
      gap: 2px;
    }

    .row {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      height: 100%;
      border: 1px solid #000;
    }

    .col {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-grow: 1;
      width: 100%;
    }

    gecut-icon {
      font-size: 64px;
      color: inherit;
    }
  `;

  override render(): LitRenderType {
    const colors = [
      'primary',
      'secondary',
      'tertiary',
      'neutral',
      'neutral-variant',
      'error',
    ] as const;

    const icons: Record<(typeof colors)[number], string[]> = {
      'primary': [
        eyeLinearIcon,
        peopleLinearIcon,
        clockLinearIcon,
        editLinearIcon,
        userSearchLinearIcon,
        copyLinearIcon,
        callLinearIcon,
        userOctagonLinearIcon,
        calendarLinearIcon,
        messageAddLinearIcon,
      ],
      'secondary': [
        eyeBoldIcon,
        peopleBoldIcon,
        clockBoldIcon,
        editBoldIcon,
        userSearchBoldIcon,
        copyBoldIcon,
        callBoldIcon,
        userOctagonBoldIcon,
        calendarBoldIcon,
        messageAddBoldIcon,
      ],
      'tertiary': [
        eyeBrokenIcon,
        peopleBrokenIcon,
        clockBrokenIcon,
        editBrokenIcon,
        userSearchBrokenIcon,
        copyBrokenIcon,
        callBrokenIcon,
        userOctagonBrokenIcon,
        calendarBrokenIcon,
        messageAddBrokenIcon,
      ],
      'neutral': [
        eyeBulkIcon,
        peopleBulkIcon,
        clockBulkIcon,
        editBulkIcon,
        userSearchBulkIcon,
        copyBulkIcon,
        callBulkIcon,
        userOctagonBulkIcon,
        calendarBulkIcon,
        messageAddBulkIcon,
      ],
      'neutral-variant': [
        eyeOutlineIcon,
        peopleOutlineIcon,
        clockOutlineIcon,
        editOutlineIcon,
        userSearchOutlineIcon,
        copyOutlineIcon,
        callOutlineIcon,
        userOctagonOutlineIcon,
        calendarOutlineIcon,
        messageAddOutlineIcon,
      ],
      'error': [
        eyeTwoToneIcon,
        peopleTwoToneIcon,
        clockTwoToneIcon,
        editTwoToneIcon,
        userSearchTwoToneIcon,
        copyTwoToneIcon,
        callTwoToneIcon,
        userOctagonTwoToneIcon,
        calendarTwoToneIcon,
        messageAddTwoToneIcon,
      ],
    };

    const rows = map(colors, (color) => {
      icons[color] = random.shuffle(icons[color]);

      const cols = map(range(10), (i) => {
        const cssBgColor = `--ref-palette-${color}${(10 - i) * 10}`;
        const cssColor = `--ref-palette-${color}${i >= 5 ? 98 : 10}`;

        const style = styleMap({
          backgroundColor: `hsl(var(${cssBgColor}))`,
          color: `hsl(var(${cssColor}))`,
        });

        return html`
          <div class="col" style=${style}>
            <gecut-icon .svgContent=${icons[color][i]}></gecut-icon>
          </div>
        `;
      });

      return html`<div class="row">${cols}</div>`;
    });

    return html`${rows}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'color-palette': ColorPalette;
  }
}
