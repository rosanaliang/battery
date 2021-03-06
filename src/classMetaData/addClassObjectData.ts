import { ClassMetaData } from '../types/classname';
import { DeveloperBatteryConfig } from '../types/battery-config';
import { generateClassObject } from '../utils/classObjects';
import { PluginConfig } from '../types/plugin-config';

const isPropMatch = (arr1: string[], arr2: string[]) => {
  return arr1.every(item => arr2.includes(item));
};

export const addClassObjectData = (
  classMetaArr: ClassMetaData[],
  config: DeveloperBatteryConfig,
) => {
  return classMetaArr.map(classMeta => {
    const propConfig = config.props.find(propConfig =>
      isPropMatch(propConfig.cssProperty, classMeta.property),
    );
    let value = '';

    if (classMeta.keyword) {
      value =
        classMeta.explodedSource.valueIdentifier === ''
          ? propConfig.values['__DEFAULT__']
          : propConfig.values[classMeta.explodedSource.valueIdentifier];
      classMeta.classObject = generateClassObject(classMeta.property, value);
      return classMeta;
    }

    const plugin: PluginConfig = config.plugins.find(
      pluginConfig => pluginConfig.name === classMeta.valuePlugin,
    );

    if (classMeta.valuePluginType === 'lookup') {
      value = plugin.values[classMeta.explodedSource.valueIdentifier];
    }

    if (classMeta.valuePluginType === 'pattern') {
      value = classMeta.explodedSource.valueIdentifier;
    }

    let modifierFn = (x: string, y: string) => `${x}${y}`;

    if (classMeta.valueModifier) {
      modifierFn = plugin.modifiers.find(
        modifier => modifier.name === classMeta.valueModifier,
      ).modifierFn;
      value = modifierFn(value, classMeta.explodedSource.modifierIdentifier);
    }

    classMeta.classObject = generateClassObject(classMeta.property, value);

    return classMeta;
  });
};
