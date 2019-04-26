# Vue createContext

[![npm version](https://badge.fury.io/js/vue-create-context.svg)](https://badge.fury.io/js/vue-create-context)

An abstracted util factory for creating declarative and reactive contexts component in Vue. This API abstraction is greatly inspired by [`React.createContexts`](https://reactjs.org/docs/context.html#reactcreatecontext). The usage and its behaviour is exactly the same as you may expect if you already familiar with React. Under the hood, it uses Vue's reactive system with its `provide/inject` and scoped-slot API. It is light weight, declarative, and easy to use.

## 🧰 Requirements

This library requires Vue 2.6+, where Vue introduces the `v-slot` derivative, opening a new declarative pattern for passing component props in a compositional manner.

## 🎬 Getting started

To get it started, add this package into your project:

```bash
yarn add -D vue-create-context
```

## 📔 API

### `createContext`

```js
import { createContext } from 'vue-create-context';
const MyContext = createContext(defaultValue);
```

Calling `createContext` with the `defaultValue` to create a context object. The `defaultValue` can be either a reference object or primitive, which is **ONLY** used when the `Consumer` component can not find its paired `Provider` above the rendering tree. The behaviour is the same as the one in React, so you can also have a look at [React.createContext](https://reactjs.org/docs/context.html#reactcreatecontext).

### `Context.Provider`

```vue
<MyContext.Provider :value={/* the provided value */}>
```

The `Provider` accept a `value` prop to be any value you want it to pass down the rendering tree. Similar to React, you can use this component multiple times an any level of the rendering tree. Its conjugated `Consumer` will receive the value from the closest `Provider` among its ancestors.

Note: If the provided value is reactive, update this value "reactively" will also update all its subscribed descended `Consumers`.

### `Context.Consumer`

```vue
<MyContext.Consumer v-slot="/* slot props: the value injected by the closed Provider */">
  /* you can access the value within the block */
</MyContext.Consumer>
```

The `Consumer` gives the access to the injected value from the closest `Provider`. Unlike React, where uses the CAAF (children as a function, also known as the "render prop") pattern to access the value, we uses `v-slot` inside the component block template to access the value (the so called "slot props"). If you uses single file component (SFC) or browsers supports ES6+ object spread operator, you can take the advantage of object destructuring (see more on [Vue's official page](https://vuejs.org/v2/guide/components-slots.html#Destructuring-Slot-Props)).

It is worth to mention that due to the current limitation of Vue's scoped slot API, the slot props have to be an object, so it is recommended to give the value as an plan old javascript object (POJO). In the case of the provided value to be a primitive, it will be normalized as an object with a `value` key to get the passed value in `v-slot`, i.e. `{ value: /* your provided value */ }`.

Note. You might be tempted to mutate the injected value from the consumer. This is a bad idea since it violate the "[props down event up principle](https://vuejs.org/v2/style-guide/#Implicit-parent-child-communication-use-with-caution)". Under the hood, the library leverage the `computed` property in the `Consumer`, and you would not able to update/mutate on the source value. This is also consistent with the behaviour of Vue's `provide/inject` API.

## 💎 Example

There is an example in [the Official Storybook Vue](https://storybooks-vue.netlify.com/?path=/story/addon-contexts--languages) as an example of the `createContexts`.

For people using the SFC format, here is an conceptual example:

```vue
<template>
  <div>
    <Provider :value="currentUser">
      <Consumer v-slot="{ firstName, lastName }">
        <p>Hello {{ lastName }}, {{ firstName }}!</p>
        <!-- Hello Newman, Jack! -->
      </Consumer>
    </Provider>
    <Consumer v-slot="{ firstName, lastName }">
      <p>Hello {{ firstName }}, {{ lastName }}!</p>
      <!-- Hello N/A, N/A! -->
    </Consumer>
  </div>
</template>

<script>
import { createContext } from 'vue-create-context';
const userContext = createContext({ firstName: 'N/A', lastName: 'N/A' }); // normally it is imported from other files.

module.exports = {
  name: 'MyComponent',
  components: {
    Provider: userContext.Provider,
    Consumer: userContext.Consumer,
  },
  data() {
    return {
      firstName: 'Jack',
      lastName: 'Newman',
    };
  },
};
</script>
```

## 📖 License

MIT
