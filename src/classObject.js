import { createPluginsObject } from './plugins/';
import {
  generateValuePluginRegexSequencer,
  generateRegexSequencer
} from './sequencers';

import {
  getPluginPropConfigs
} from './plugins/';

import {
  getKeywordClassObjs,
  generateKeywordValueObjs
} from './plugins/keywordValueType';

export const generateClassObject = ({
  className,
  cssProps,
  value,
}) => {
  const eachProp = cssProps
    .split(' ')
    .reduce((props,prop) => {
      props[prop] = value;
      return props;
    },{});
  return ( { [className]: eachProp } );
};

const getProps = (cxPropName,propConfigs) => {
  if (cxPropName === '') {
    return propConfigs
      .filter(x => x.pluginDefault === true)
      .map(x => x.prop)
      .join('');
  } else {
    return propConfigs
      .filter(x => {
        const { propName, separator = '' } = x;
        return cxPropName === propName+separator;
      })
      .map(x => x.prop)
      .join('');
  }
};

const modifyValue = (value,modifier,pluginConfig) => {
  const hasDefaultModifier = pluginConfig.valueModifiers
    .some(x => x.default === true);
  let modifierValue;

  if (hasDefaultModifier && modifier === undefined) { modifier = ''; }

  if (modifier !== undefined) {
    const valueModifier = pluginConfig.valueModifiers
      .sort((a,b) => b.indicator.length - a.indicator.length)
      .filter(x => {
        const { separator = '', indicator } = x;
        const regex = new RegExp(`${separator+indicator}`);

        if (indicator === '' && modifier !== '') { return false; }
        else if (modifier === separator+indicator) { return true; }
        else if (regex.test(modifier)) {
          modifierValue = modifier.replace(separator,'');
          return true;
        }
        else { return false; }
      })[0];
    return valueModifier.modifierFn(value,modifierValue);
  } else {
    return value;
  }
};


const getValue = (value,modifier,pluginConfig,lookupValues) => {
  if (lookupValues) { value = lookupValues[value]; }
  if (pluginConfig.valueModifiers) {
    value = modifyValue(value,modifier,pluginConfig);
  }

  return value;
};

const convertClassNameToClassObj = (className,sequencedRegexes,pluginConfig,propConfigs,lookupValues) => {
  let previouslyMatched = 0;

  return Object.keys(sequencedRegexes)
    .sort((a,b) => b - a)
    .reduce((zs,charLength) => {
      if (previouslyMatched === 1) return zs;

      const regexString = sequencedRegexes[charLength][pluginConfig.name];
      if (regexString === undefined) return zs;

      const classNameArr = className.match(regexString);
      if (classNameArr === null) return zs;

      previouslyMatched = 1;

      const propName = classNameArr[2];

      let value = classNameArr[3];
      const valueModifier = classNameArr[4];

      const convertedClassObj = generateClassObject({
        className: className,
        cssProps: getProps(propName,propConfigs),
        value: getValue(value,valueModifier,pluginConfig,lookupValues)
      });

      zs = { ...zs, ...convertedClassObj };
      return zs;
    },{});
};



export const convertClassNamestoClassObjs = (sortedClassNames,plugins,props) => {
  const pluginNames = Object.keys(sortedClassNames);
  const pluginRegexes = generateValuePluginRegexSequencer(plugins,props);
  const pluginsObject = createPluginsObject(plugins);

  const convertedClassNames = pluginNames
    .reduce((xs,pluginName) => {
      const classNames = sortedClassNames[pluginName];

      if(pluginName === 'keyword') {
        const preCompiledKeywordObjs = generateKeywordValueObjs(props);
        xs = { ...xs, ...getKeywordClassObjs(classNames,preCompiledKeywordObjs) };
      } else {
        const pluginConfig = pluginsObject[pluginName];
        const { name, values } = pluginConfig;

        const propConfigs = getPluginPropConfigs(name,props);

        classNames.forEach(cx => {
          let convertedClassName;
          if (values) {
            convertedClassName = convertClassNameToClassObj(cx,pluginRegexes,pluginConfig,propConfigs,values);
          } else {
            convertedClassName = convertClassNameToClassObj(cx,pluginRegexes,pluginConfig,propConfigs);
          }

          xs = { ...xs, ...convertedClassName };
        });
      }

      return xs;
    },{});

  return convertedClassNames;
};