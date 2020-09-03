import {useState, useCallback} from 'react'

export const useSetState = (initialState) => {
  const [state, setState] = useState(initialState)

  const useNextState = useCallback((patch) => {
    setState((prevState) => Object.assign({}, prevState, patch instanceof Function ? patch(prevState) : patch))
  }, [setState])

  return [state, useNextState]
}
