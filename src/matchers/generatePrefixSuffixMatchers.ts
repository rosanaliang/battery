import { Plugin } from 'types/plugin-config';

export const generatePrefixSuffixdMatchers = (plugins: Plugin[]) => {
  const baseObject = {
    prefixes: '^',
    suffixes: '$',
  };
  if (!plugins || plugins.length < 1) {
    return baseObject;
  }

  const prefixedPlugins = plugins.filter(
    plugin => plugin.identifierType === 'prefix',
  );

  const suffixedPlugins = plugins.filter(
    plugin => plugin.identifierType === 'suffix',
  );

  let prefixes;
  let suffixes;

  if (prefixedPlugins.length > 0) {
    prefixes = prefixedPlugins
      .map(plugin =>
        plugin.modifiers.reduce((accum, modifier) => {
          const { identifier, separator = '' } = modifier;
          return accum.concat(`${identifier}${separator}`);
        }, []),
      )
      .reduce((xs, x) => xs.concat(x), [])
      .concat('^')
      .join('|');
  }

  if (suffixedPlugins.length > 0) {
    suffixes = prefixedPlugins
      .map(plugin =>
        plugin.modifiers.reduce((accum, modifier) => {
          const { identifier, separator = '' } = modifier;
          return accum.concat(`${separator}${identifier}`);
        }, []),
      )
      .reduce((xs, x) => xs.concat(x), [])
      .concat('^')
      .join('|');
  }

  return {
    prefixes: prefixes ? prefixes : '^',
    suffixes: suffixes ? suffixes : '$',
  };
};
