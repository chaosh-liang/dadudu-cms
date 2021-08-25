import { createStore, combineReducers } from 'redux';
import initReducer from './reducer';
import { devToolsEnhancer  } from 'redux-devtools-extension';
import { DynamicStore, DynamicReducer } from 'src/@types/reducer';

const reducer = combineReducers(initReducer);
const store = createStore(reducer, devToolsEnhancer({ name: '大嘟嘟' }));

store.asyncReducers = { ...initReducer };
// console.log('store >>> ', store);

// 动态注入 reducer
export const injectReducer = (store: DynamicStore, { key, reducer }: DynamicReducer) => {
  if (Reflect.has(store.asyncReducers, key)) return;
  store.asyncReducers[key] = reducer;
  store.replaceReducer(combineReducers({ ...store.asyncReducers }));
  // console.log('injectReducer after: ', Reflect.ownKeys(store.asyncReducers));
};

// 暴露 reducer 类型
export type RootState = ReturnType<typeof store.asyncReducers>

export default store;
