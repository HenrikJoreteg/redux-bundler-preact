# redux-bundler-preact

![](https://img.shields.io/npm/dm/redux-bundler-preact.svg)![](https://img.shields.io/npm/v/redux-bundler-preact.svg)![](https://img.shields.io/npm/l/redux-bundler-preact.svg)

Bindings for redux-bundler to Preact

## install

Install v2 for Preact >=10.0.0:

```
npm install redux-bundler-preact
```

Install v1 for Preact v3-8:

```
npm install redux-bundler-preact@^1
```

## example / docs

Similar to [react-redux](https://github.com/reactjs/react-redux), or [preact-redux](https://github.com/developit/preact-redux) this has two exports, `Provider` and `connect`.

`Provider` puts the store into the `context` so that connected components can get access to it:

```js
import { connect, Provider } from 'redux-bundler-preact'
import getStore from './bundles'
import AppRoot from './app-root'

export default () => (
  <Provider store={getStore()}>
    <AppRoot />
  </Provider>
)
```

`connect` works a bit differently for redux-bundler than you may be used to. You pass it the string names of the selectors and action creators you want to grab from the store. The last argument should always be the component itself.

```js
import { connect } from 'redux-bundler-preact'

const MyComponent = ({ myValue, myOtherValue, doInitiateSignIn }) => (
  <div onClick={doInitiateSignIn}>
    {myValue} {myOtherValue}
  </div>
)

// Here we use `connect()` to specify which selector values and action creators
// that we want to use.
// Note that it is quite inexpensive to connect many components since the diffing
// happens outside of the component entirely.
// If you try to connect something that doesn't exist, it will error at runtime
// for easier debugging
export default connect(
  'selectMyValue',
  'selectMyOtherValue',
  'doInitiateSignIn',
  MyComponent
)
```

## credits

If you like this follow [@HenrikJoreteg](http://twitter.com/henrikjoreteg) on twitter.

## license

[MIT](http://mit.joreteg.com/)
