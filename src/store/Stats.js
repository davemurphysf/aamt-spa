export const requestSignIn = 'SIGN_IN_STARTED';
export const receiveSignIn = 'SIGN_IN_RECEIVED';
export const signInError = 'SIGN_IN_ERROR';
export const signOut = 'SIGN_OUT';
export const receiveSignInStats = 'SIGN_IN_STATS_RECEIVED';
export const receiveAnalyzeStats = 'ANALYZE_STATS_RECEIVED';
export const receiveFetchStats = 'FETCH_STATS_RECEIVED';

const initialState = {
    signalRConnecting: false,
    signalRConnected: false,
    signIns: 0,
    tweetsFetched: 0,
    textAnalyzed: 0,
    picturesAnalyzed: 0,
    usernames: {}
};

export const actionCreators = {

};

export const reducer = (state, action) => {
    state = state || initialState;

    if (action.type === requestSignIn) {
        return {
            ...state,
            signalRConnecting: true,
            signalRConnected: false,
            signIns: action.signIns,
            tweetsFetched: action.tweetsFetched,
            usernames: Object.assign({}, state.usernames, action.usernames),
            textAnalyzed: action.textAnalyzed,
            picturesAnalyzed: action.picturesAnalyzed
        };
    }

    if (action.type === receiveSignIn) {
        return {
            ...state,
            signalRConnecting: false,
            signalRConnected: true
        };
    }

    if (action.type === signInError) {
        return {
            ...state,
            signalRConnecting: false,
            signalRConnected: false
        };
    }

    if (action.type === signOut) {
        return {
            ...state,
            signalRConnecting: false,
            signalRConnected: false
        };
    }

    if (action.type === receiveSignInStats) {
        return {
            ...state,
            signIns: action.signIns
        };
    }

    if (action.type === receiveAnalyzeStats) {
        return {
            ...state,
            textAnalyzed: action.text,
            picturesAnalyzed: action.pictures
        };
    }

    if (action.type === receiveFetchStats) {
        return {
            ...state,
            tweetsFetched: action.tweetsFetched,
            usernames: Object.assign({}, state.usernames, action.usernames)
        };
    }

    return state;
};