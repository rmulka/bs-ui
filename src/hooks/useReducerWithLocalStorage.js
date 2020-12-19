import { useReducer } from 'react';

import useLocalStorage from './useLocalStorage';

// credit: https://gist.github.com/mattiaerre/8dbd2d8efca3f242c7085a9ce82ecbde
const useReducerWithLocalStorage = (reducer, initialState, key) => {
    const [localStorageState, setLocalStorageState] = useLocalStorage(
        key,
        initialState
    );

    return useReducer(
        (state, action) => {
            const newState = reducer(state, action);
            setLocalStorageState(newState);
            return newState;
        },
        { ...localStorageState }
    );
}

export default useReducerWithLocalStorage;