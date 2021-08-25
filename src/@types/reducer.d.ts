
import type { Store, Reducer  } from 'redux';

export interface DynamicStore extends Store {
  asyncReducers: Record<string, Reducer>
}

export interface DynamicReducer {
  key: string;
  reducer: Reducer;
}
