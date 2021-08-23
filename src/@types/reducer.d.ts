
import type { Store, Reducer  } from 'redux';

export interface InjectStore extends Store {
  asyncReducers: Record<string, Reducer>
}

export interface InjectReducer {
  key: string;
  reducer: Reducer;
}
