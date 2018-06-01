import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { createBrowserHistory } from 'history';
import configureStore from './store/configureStore';
import App from './App';
import { signalRRegisterCommands } from './store/SignalRMiddleware'

// Create browser history to use in the Redux store
const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const history = createBrowserHistory({ basename: baseUrl });

// Get the application-wide store instance, prepopulating with state from the server where available.
const initialState = window.initialReduxState || {};

let username = '';
let loggedIn = false;

var cookies = document.cookie.split(';').map(c => c.trim());
for (var i = 0; i < cookies.length; i++) {
    if (cookies[i].startsWith('twitter_username=')) {
        username = unescape(cookies[i].slice('twitter_username'.length + 1));
        loggedIn = true;
    }
}

initialState.auth = { username, loggedIn };

const store = configureStore(history, initialState);

signalRRegisterCommands(store, () => {
    const rootElement = document.getElementById('root');

    ReactDOM.render(
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <App />
            </ConnectedRouter>
        </Provider>,
        rootElement);
});
