// import { HubConnectionBuilder, HttpTransportType, LogLevel } from '@aspnet/signalr/dist/browser/signalr.js';

// const connection = new HubConnectionBuilder()
//     .withUrl('/chat', { transport: HttpTransportType.WebSockets })
//     .configureLogging(LogLevel.Debug)
//     .build();

const connection = [];

export function signalRInvokeMiddleware(store) {
    return (next) => async (action) => {
        switch (action.type) {
            case "SIGNALR_FETCH_TWEETS":
                connection.invoke('FetchTweets');
                break;
            case "SIGNALR_ANALYZE_TEXT":
                connection.invoke('TextAnalysis', action.text);
                break;
            case "SIGNALR_ANALYZE_IMAGE":
                connection.invoke('ImageAnalysis', action.imageUrl);
                break;
            default:
                break;
        }

        return next(action);
    }
}

export function signalRRegisterCommands(store, callback) {
    callback();

    // connection.on('tweet', data => {
    //     if (!data) return;

    //     store.dispatch({
    //         type: 'RECEIVE_TWEET',
    //         tweet: data
    //     });

    //     console.log('Tweet received');
    //     console.log('Tweet', data);
    // });

    // connection.on('textAnalysis', data => {
    //     if (!data) return;

    //     store.dispatch({
    //         type: 'RECEIVE_TEXT_ANALYSIS',
    //         tweet: data
    //     });

    //     console.log('Text Analysis received');
    //     console.log(data);
    // });

    // connection.on('imageAnalysis', data => {
    //     if (!data) return;

    //     store.dispatch({
    //         type: 'RECEIVE_IMAGE_ANALYSIS',
    //         tweet: data
    //     });

    //     console.log('Image Analysis received');
    //     console.log(data);
    // });

    // connection.onclose(error => {
    //     if (error && error.message) {
    //         console.error('Connection error');
    //         console.error(error.message);
    //     } else {
    //         console.log('Connection closed');
    //     }
    // });

    // connection
    //     .start()
    //     .then(() => {
    //         console.log('SignalR Connected');
    //         callback();
    //     })
    //     .catch(function (error) {
    //         console.log('Connection error');
    //         if (error) {
    //             if (error.message) {
    //                 console.error(error.message);
    //             }
    //         }
    //     });
}