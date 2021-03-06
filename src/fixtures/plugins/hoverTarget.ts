import { PluginConfig } from '../../types/plugin-config';

export const hoverTargetPlugin: PluginConfig = {
  name: 'hoverTarget',
  type: 'selector',
  affixType: 'prefix',
  modifiers: [
    {
      name: 'hoverItem',
      separator: '-',
      identifier: 'hover-item',
      modifierFn: selector => `hover-target:hover .${selector}`,
    },
  ],
};
