import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';

// 严格模式报此警告："findDOMNode is deprecated in StrictMode" warning
const TerminalJsx =
  process.env.NODE_ENV === 'production' ? (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  ) : (
    <App />
  );

ReactDOM.render(
  TerminalJsx,
  document.getElementById('root')
);
