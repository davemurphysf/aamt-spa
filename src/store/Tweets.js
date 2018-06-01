const requestTweetsType = 'SIGNALR_FETCH_TWEETS';
const receiveTweetsType = 'RECEIVE_TWEET';
const requestAnalyzeTextType = 'SIGNALR_ANALYZE_TEXT';
const receiveAnalyzeTextType = 'RECEIVE_TEXT_ANALYSIS';
const requestAnalyzeImageType = 'SIGNALR_ANALYZE_IMAGE';
const receiveAnalyzeImageType = 'RECEIVE_IMAGE_ANALYSIS';

const initialState = {
    tweets: {},
    isLoading: false
};

export const actionCreators = {
    requestTweets: () => async (dispatch, getState) => {
        dispatch({
            type: requestTweetsType
        });
    },
    requestTextAnalysis: (text) => async (dispatch, getState) => {
        dispatch({
            type: requestAnalyzeTextType,
            text: text
        });
    },
    requestImageAnalysis: (imageUrl) => async (dispatch, getState) => {
        dispatch({
            type: requestAnalyzeImageType,
            imageUrl: imageUrl
        });
    }
};

export const reducer = (state, action) => {
    state = state || initialState;

    if (action.type === requestTweetsType) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === receiveTweetsType) {
        const updatedTweetsObj = Object.assign({}, state.tweets);

        if (action.tweet && action.tweet.id) {
            updatedTweetsObj[action.tweet.id] = action.tweet;
        }

        return {
            ...state,
            tweets: updatedTweetsObj,
            isLoading: false
        };
    }

    if (action.type === receiveAnalyzeTextType) {
        return { ...state };
    }

    if (action.type === receiveAnalyzeImageType) {
        return { ...state };
    }

    return state;
};