import { ActionType } from 'src/store/action_type';
import type { AnyAction, Reducer } from 'redux';

const initState = {
  category: [], // 类别数据
};

const reducer: Reducer<typeof initState, AnyAction> = (
  state = initState,
  action
) => {
  const { type, payload } = action;
  switch (type) {
    case ActionType.SET_CATEGORY_DATA: {
      const { data } = payload;
      return { ...state, category: data };
    }
    default:
      return state;
  }
};

export default reducer;
