import { Component, h } from 'preact'

export const Provider = function () {}
Provider.prototype.getChildContext = function () {
  return { store: this.props.store }
}
Provider.prototype.render = props => props.children[0]

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

  return class Connect extends Component {
    constructor (props, context) {
      super(props, context)
      const store = context.store
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
}
