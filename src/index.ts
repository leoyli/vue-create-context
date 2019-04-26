import { Component } from 'vue';

type createContext = (defaultValue: unknown) => { Provider: Component; Consumer: Component };

export const createContext: createContext = (defaultValue) => {
  const key = `_${Date.now()}${Math.random()}`;
  return {
    Provider: {
      name: 'Context.Provider',
      props: ['value'],
      provide(this: any) {
        return this.value === undefined ? undefined : { [key]: () => this.value };
      },
      render(this: any) {
        return this.$slots.default;
      },
    },
    Consumer: {
      name: 'Context.Consumer',
      inject: {
        [key]: {
          default: () => () =>
            defaultValue instanceof Object ? { ...defaultValue } : { value: defaultValue },
        },
      },
      computed: {
        value(this: any) {
          return this[key]();
        },
      },
      render(this: any) {
        return this.$scopedSlots.default(this.value);
      },
    },
  };
};
