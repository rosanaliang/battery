import { PropertyConfig } from '../../types/property-config';

export const margin: PropertyConfig = {
  cssProperty: 'margin',
  classNamespace: 'm',
  subProps: {
    all: '',
    top: 't',
    right: 'r',
    bottom: 'b',
    left: 'l',
    vertical: 'y',
    horizontal: 'x',
  },
  valueSeparator: '-',
  values: {
    auto: 'auto',
    inherit: 'inherit',
  },
  valuePlugin: 'lengthUnit',
};
