import { Component } from 'vue';

type createContext = (defaultValue: unknown) => { Provider: Component; Consumer: Component };

export const createContext: createContext = (defaultValue) => {
  const key = `_${Date.now()}${Math.random()}`;
  return {
    Provider: {
      name: 'Context.Provider',
      props: ['value'],
      provide(this: any) {
        return { [key]: () => this.value };
      },
      render(this: any) {
        return this.$slots.default;
      },
    },
    Consumer: {
      name: 'Context.Consumer',
      functional: true,
      inject: {
        value: {
          from: key,
          default: () => () =>
            defaultValue instanceof Object ? { ...defaultValue } : { value: defaultValue },
        },
      },
      render: (h, contexts: any) => contexts.scopedSlots.default(contexts.injections.value()),
    },
  };
};
