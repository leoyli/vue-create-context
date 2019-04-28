# Vue createContext

[![npm version](https://badge.fury.io/js/vue-create-context.svg)](https://badge.fury.io/js/vue-create-context)

An abstracted util factory for creating **scoped**, **declarative**, and **reactive** context-components in Vue. This API abstraction is greatly inspired by [`React.createContext`](https://reactjs.org/docs/context.html) using Vue's [`prvide/inject` API](https://vuejs.org/v2/api/#provide-inject) under the hood. The usage and its behaviour is exactly the same as you may expect if you already familiar with React. With this library to power up your Vue application, you then now able to use `prvide/inject` in an explicit, but declarative manner for managing application contexts using component composition. It's just that easy.

## ✨ Highlights

- Solve **prop-drilling** without the full state management solution; good for library development.
- Declarative, reusable, but explicit, you know where your data came from and how to access it.
- Easier to debug, just search `Context.Provider` in the devTool then you know where data get injected.
- Free from name clash, there are just no chance to mess up `provide/inject`. Zero overhead!
- Seamless developing experiences for people came from React.

## 🧰 Requirements

This library recommend to have Vue 2.6+, so we can leverage the `v-slot` derivative to write readable code.

## 🎬 Getting started

To get it started, add this package into your project:

```bash
yarn add vue-create-context
```

## 📔 API

It is recommended to read [React context doc](https://reactjs.org/docs/context.html) to have a better idea on the API design. The doc here will just focus on the usage and the difference in Vue.

### `createContext`

```js
import { createContext } from 'vue-create-context'

const MyContext = createContext(defaultValue)
```

Calling `createContext` with the `defaultValue` to create a context object. The `defaultValue` can be either a referential object or primitive, which is **ONLY** used when the `Consumer` component can not find its conjugated `Provider` above the rendering tree.

### `Context.Provider`

```vue
<MyContext.Provider value={/* the provided value */}>
```

The `Provider` accept a `value` prop to be any value you want it to pass down the rendering tree. Similar to React, you can use this component multiple times an any level of the tree. Its conjugated `Consumer` will receive the value from the closest `Provider` among its ancestors.

Note: If the provided value is reactive, update this value "reactively" will also update all its subscribed descended `Consumers`. Also, make the value `undefined` (either explicitly passed in or implicitly set to) **WON'T** letting `Consumer` to use the `defaultValue`, which is the same as in React.

### `Context.Consumer`

```vue
<MyContext.Consumer v-slot="/* slot props: the value injected by the closed Provider */">
  <!-- you can access the value within the block -->
</MyContext.Consumer>
```

The `Consumer` is a _functional_ component gives the access to the injected value from the closest `Provider`. Unlike React, where uses the CAAF (children as a function, also known as the "render prop") pattern to access the value, we uses `v-slot` inside the component block template to access the value (the so called "slot props"). If you uses single file component (SFC) or browsers supports ES6+ object spread operator, you can take the advantage of object destructuring (see more on [Vue's official documentation](https://vuejs.org/v2/guide/components-slots.html#Destructuring-Slot-Props)).

It is worth to mention that due to the current implementation of Vue's scoped slot API, the slot props have to be an object, so it is recommended to give the value as an plan old javascript object (POJO). In the case of the provided value to be a primitive, it will be normalized as an object with a `value` property to get the passed value in `v-slot`, i.e. `{ value: /* your provided value */ }`.

Note: You might be tempted to mutate the injected value from the consumer block. This is generally a bad idea since it violate the principle of "[props down, event up](https://vuejs.org/v2/style-guide/#Implicit-parent-child-communication-use-with-caution)"; therefore, it is recommend to treat the slot props as read only properties. Under the hood, this reactivity behaviour of slot props is just a reflection of the `provide/inject` API.

### `Context._context`

Internally, calling `createContext` will generate an unique identifier as a key to access the inject value at runtime, that is why there are no such chance to have clashes. But if you need the injected value to be used in `computed` property, then you manually have to setup `inject` property on the component instance (thanks to Vue's core team member @linusborg for pointing out this). For such usage, you can bind the injected context as the following:

```js
{
  inject: {
    [name]: MyContext._context,
  },
  computed: {
    [something]() {
      return this[name]() // please note 'this[name]' is a accessor function with reactivity.
    },
  },
}
```

Node: the bound property is a **function** that returns the injected value, which follows the same rule as in `Consumer`. You can still expect to receive the `defaultValue` in case have no `Provider` being traced.

## 💎 Example

There is a story in [the Official Storybook Vue](https://monorepo-git-add-addon-contextsvue-i.storybook.now.sh/examples/vue-kitchen-sink/?path=/story/addon-contexts--languages) as an example of the `createContexts`.

For people using the SFC format, here is an conceptual example.

#### SomeContext.js

```js
import { createContext } from 'vue-create-context';

export const CurrentUserContext = createContext({ firstName: 'Null', lastName: 'Unknown' });
```

#### SomeComponent.vue

```vue
<template>
  <div>
    <!-- ... -->
    <Consumer v-slot="{ firstName, lastName }">
      <!-- Do something, where firstName, lastName is destructured from the received value -->
    </Consumer>
    <!-- ... -->
  </div>
</template>

<script>
import { Consumer } from './SomeContext';

module.exports = {
  name: 'SomeComponent',
  components: {
    Consumer,
  },
};
</script>
```

#### App.vue

```vue
<template>
  <div>
    <Provider :value="user">
      <div>
        <SomeComponent />
        <!-- Consumer in the above component get { firstName: 'Jack', lastName: 'Newman' } -->
        <Provider value="{ firstName: 'Amy', lastName: 'Smith' }">
          <SomeComponent />
          <!-- Consumer in the above component get { firstName: 'Amy', lastName: 'Smith' } -->
        </Provider>
      </div>
    </Provider>
    <SomeComponent />
    <!-- Consumer in the above component get { firstName: 'Null', lastName: 'Unknown' } -->
  </div>
</template>

<script>
import { Provider } from './SomeContext';
import SomeComponent from './SomeComponent';

module.exports = {
  name: 'App',
  components: {
    Provider,
    SomeComponent,
  },
  data() {
    return {
      user: {
        firstName: 'Jack',
        lastName: 'Newman',
      },
    };
  },
};
</script>
```

## 📖 License

MIT
