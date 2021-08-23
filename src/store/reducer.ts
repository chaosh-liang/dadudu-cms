import { ActionType } from './action_type';

interface Action {
  type: string;
  payload: Record<string, any>
}

const initState = { // 初始 state
  field1: '示例字段1',
  field2: '示例字段2',
};

const initialReducer = (state = initState, action: Action) => {
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
