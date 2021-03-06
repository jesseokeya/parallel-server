import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css'
import { StoreProvider } from "./store";
import App from './components/App';
import * as serviceWorker from './workers/serviceWorker';

ReactDOM.render(
    <StoreProvider>
        <App />
    </StoreProvider>, 
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
