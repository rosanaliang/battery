import { ClassMetaData } from 'types/classname';
import { Matchers } from 'types/matchers';
import { UserPropConfig } from 'types/prop-config';

export const addPropertyData = (
  classMetaArr: ClassMetaData[],
  matchers: Matchers,
  props: UserPropConfig[],
  generatedKeywordMetaData: ClassMetaData[],
): ClassMetaData[] =>
  classMetaArr.map(classMeta => {
    const matcher = Object.entries(matchers).find(([_, regex]) => {
      return regex.test(classMeta.source);
    });

    if (!matcher) {
      classMeta.invalid = true;
      return classMeta;
    }

    const [matcherName, regex] = matcher;

    if (matcherName === 'keyword') {
      const property = generatedKeywordMetaData.find(generated =>
        new RegExp(generated.source).test(classMeta.source),
      ).property;
      classMeta.property = property;

      return classMeta;
    }

    const pluginSeparatorsRegex = new RegExp(
      `[${props.map(prop => prop.pluginSeparator).join('')}]`,
    );

    const classNamespace = classMeta.source
      .match(regex)[2]
      .replace(pluginSeparatorsRegex, '');

    const property = props.find(prop => {
      if (classNamespace.length > 0 && prop.classNamespace) {
        const matched = prop.classNamespace.match(new RegExp(classNamespace));
        return (
          prop.valuePlugin === matcherName && matched && matched.length > 0
        );
      } else if (classNamespace.length === 0 && prop.pluginDefault) {
        return prop.valuePlugin === matcherName && prop.pluginDefault;
      } else {
        return false;
      }
    }).cssProperty;

    classMeta.property = property;
    return classMeta;
  });
