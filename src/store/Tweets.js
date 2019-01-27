import axios from "axios";

const requestTweetsType = 'FETCH_TWEETS';
const receiveTweetsType = 'RECEIVE_TWEETS';
const tweetsErrorType = 'TWEETS_ERROR';
const requestAnalyzeTextType = 'REQUEST_ANALYZE_TEXT';
const receiveAnalyzeTextType = 'RECEIVE_TEXT_ANALYSIS';
const requestAnalyzeImageType = 'REQUEST_ANALYZE_IMAGE';
const receiveAnalyzeImageType = 'RECEIVE_IMAGE_ANALYSIS';

const initialState = {
    tweets: {},
    textAnalysis: {},
    imageAnalysis: {},
    isLoading: false
};

export const actionCreators = {
    requestTweets: (username) => async (dispatch, getState) => {
        dispatch({
            type: requestTweetsType
        });

        try {
            const fetchResponse = await axios.get(`https://aamt-func.azurewebsites.net/api/fetchtweets`, {
                params: {
                    username: username,
                    count: 20
                }
            });

            dispatch({
                type: receiveTweetsType,
                tweets: JSON.parse(fetchResponse.data)
            });
        } catch (error) {
            dispatch({
                type: tweetsErrorType,
                errorMessage: 'Requesting tweets failed'
            });
        }
    },
    requestTextAnalysis: (tweet) => async (dispatch, getState) => {
        dispatch({
            type: requestAnalyzeTextType
        });

        try {
            const postResponse = await axios.post(`https://aamt-func.azurewebsites.net/api/analyzetext`, tweet);

            dispatch({
                type: receiveAnalyzeTextType,
                textAnalysis: postResponse.data,
                tweetId: tweet.id
            });
        } catch (error) {
            dispatch({
                type: tweetsErrorType,
                errorMessage: 'Requesting text analysis failed'
            });
        }
    },
    requestImageAnalysis: (id, imageUrl) => async (dispatch, getState) => {
        dispatch({
            type: requestAnalyzeTextType
        });

        try {
            const postResponse = await axios.post(`https://aamt-func.azurewebsites.net/api/analyzeimage`, {
                imageUrl: imageUrl
            });

            dispatch({
                type: receiveAnalyzeImageType,
                imageAnalysis: postResponse.data,
                tweetId: id
            });
        } catch (error) {
            dispatch({
                type: tweetsErrorType,
                errorMessage: 'Requesting image analysis failed'
            });
        }
    }
};

export const reducer = (state, action) => {
    state = state || initialState;

    if (action.type === requestTweetsType || action.type === requestAnalyzeTextType || action.type === requestAnalyzeImageType) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === receiveTweetsType) {
        const updatedTweetsObj = Object.assign({}, state.tweets);

        action.tweets.forEach((tweet) => {
            tweet.timestamp = Date.now();
            updatedTweetsObj[tweet.id] = tweet;
        });

        return {
            ...state,
            tweets: updatedTweetsObj,
            isLoading: false
        };
    }

    if (action.type === receiveAnalyzeTextType) {
        const updatedTextObj = Object.assign({}, state.textAnalysis);

        updatedTextObj[action.tweetId] = action.textAnalysis;

        return {
            ...state,
            textAnalysis: updatedTextObj,
            isLoading: false
        };
    }

    if (action.type === receiveAnalyzeImageType) {
        const updatedImageObj = Object.assign({}, state.imageAnalysis);

        updatedImageObj[action.tweetId] = action.imageAnalysis;

        return {
            ...state,
            imageAnalysis: updatedImageObj,
            isLoading: false
        };
    }

    if (action.type === tweetsErrorType) {
        console.error(action.errorMessage);
        return {
            ...state,
            isLoading: false
        };
    }

    return state;
};