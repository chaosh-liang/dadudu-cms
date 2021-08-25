import { ActionType } from './action_type';
import type { AnyAction, Reducer } from 'redux';

const initState = { // 初始 state
  field1: '示例字段1',
  field2: '示例字段2'
};

const initialReducer: Reducer = (state = initState, action: AnyAction) => {
  const { type, payload } = action;
  switch (type) {
    case ActionType.INIT_EXAMPLE_DATA: {
      const { example } = payload;
      return { ...state, field1: example };
    }
    default:
      return state;
  }
};

const initReducer = {
  init: initialReducer
};

export default initReducer;
