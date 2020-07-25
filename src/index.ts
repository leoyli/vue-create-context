import { Component } from 'vue';

type createContext = (defaultValue: unknown) => { Provider: Component; Consumer: Component };

module.exports.createContext = (defaultValue) => {
  const _key = `_${Date.now()}${Math.random()}`;
  const _context = {
    from: _key,
    default: () => () =>
      defaultValue instanceof Object ? { ...defaultValue } : { value: defaultValue },
  };

  return {
    Provider: {
      name: 'Context.Provider',
      props: ['value'],
      provide(this: any) {
        return { [_key]: () => this.value };
      },
      render(this: any) {
        return this.$slots.default;
      },
    },
    Consumer: {
      name: 'Context.Consumer',
      functional: true,
      inject: {
        value: _context,
      },
      render: (h, contexts: any) => contexts.scopedSlots.default(contexts.injections.value()),
    },
    _context,
  };
};
