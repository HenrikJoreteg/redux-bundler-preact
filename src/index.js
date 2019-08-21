import { Component, createContext, h } from 'preact'

export const StoreContext = createContext()

export const Provider = (props) => {
  const store = props.store
  const rest = {}
  Object.keys(props).forEach((key) => {
    if (key !== 'store') {
      rest[key] = props[key]
    }
  })

  return h(StoreContext.Provider, Object.assign({ value: store }, rest))
}

export const connect = (...args) => {
  const Comp = args.slice(-1)[0]
  const strings = args.length > 1 ? args.slice(0, -1) : []
  const actionCreators = []
  const keysToWatch = []
  strings.forEach((str) => {
    if (str.slice(0, 6) === 'select') {
      keysToWatch.push(str)
      return
    }
    if (str.slice(0, 2) === 'do') {
      actionCreators.push(str)
      return
    }
    throw Error(`CanNotConnect ${str}`)
  })

  class Connect extends Component {
    constructor (props) {
      super(props)
      const store = props.store
      this.state = store.select(keysToWatch)
      this.unsubscribe = store.subscribeToSelectors(keysToWatch, this.setState.bind(this))
      this.actionCreators = {}
      actionCreators.forEach((name) => {
        this.actionCreators[name] = (...args) => {
          if (store.action) {
            return store.action(name, args)
          }
          return store[name](...args)
        }
      })
    }

    componentWillUnmount () {
      this.unsubscribe()
    }

    render (props, state) {
      return h(Comp, Object.assign({}, props, state, this.actionCreators))
    }
  }

  return (props) => h(StoreContext.Consumer, undefined, (store) => {
    return h(Connect, Object.assign({ store: store }, props))
  });
}
