import { createStore, combineReducers } from 'redux';
import initReducer from './reducer';
import { devToolsEnhancer  } from 'redux-devtools-extension';
import { InjectStore, InjectReducer } from 'src/@types/reducer';

const reducer = combineReducers(initReducer);
const store = createStore(reducer, devToolsEnhancer({ name: '大嘟嘟' }));

store.asyncReducers = { ...initReducer };

// 动态注入 reducer
export const injectReducer = (store: InjectStore, { key, reducer }: InjectReducer) => {
  if (Reflect.has(store.asyncReducers, key)) return;
  store.asyncReducers[key] = reducer;
  store.replaceReducer(combineReducers({ ...store.asyncReducers }));
  // console.log('injectReducer after: ', Object.keys(store.asyncReducers));
};

// 暴露 reducer 类型
export type RootState = ReturnType<typeof reducer>

export default store;
