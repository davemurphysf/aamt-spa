import * as SignalR from "@aspnet/signalr";
import axios from "axios";
import {
    requestSignIn,
    receiveSignIn,
    signInError,
    signOut,
    receiveSignInStats,
    receiveAnalyzeStats,
    receiveFetchStats
} from "./Stats";

let connection = [];

export async function signalRRegisterCommands(store) {
    try {
        const fetchResponse = await axios.get(`https://aamt-func.azurewebsites.net/api/signin`);

        if (!fetchResponse.data.authInfo || !fetchResponse.data.authInfo.serviceUrl || !fetchResponse.data.authInfo.accessToken ||
            !fetchResponse.data.authInfo.signInStats || !fetchResponse.data.authInfo.signInStats.TotalNumber ||
            !fetchResponse.data.authInfo.fetchStats || !fetchResponse.data.authInfo.fetchStats.TotalNumber || !fetchResponse.data.authInfo.fetchStats.Username ||
            !fetchResponse.data.authInfo.analyzeStats || !fetchResponse.data.authInfo.analyzeStats.TotalText || !fetchResponse.data.authInfo.analyzeStats.TotalPicture) {
            store.dispatch({
                type: signInError
            });
            throw (new Error("Malformed request returned from signin function"));
        }

        store.dispatch({
            type: requestSignIn,
            signIns: fetchResponse.data.authInfo.signInStats.TotalNumber,
            tweetsFetched: fetchResponse.data.authInfo.fetchStats.TotalNumber,
            usernames: fetchResponse.data.authInfo.fetchStats.Username,
            textAnalyzed: fetchResponse.data.authInfo.analyzeStats.TotalText,
            picturesAnalyzed: fetchResponse.data.authInfo.analyzeStats.TotalPicture

        });

        connection = new SignalR.HubConnectionBuilder()
            .withUrl(fetchResponse.data.authInfo.serviceUrl, { accessTokenFactory: () => fetchResponse.data.authInfo.accessToken })
            .build();

    } catch (error) {
        console.error('Error on connection');
        console.error(error);

        store.dispatch({
            type: signInError
        });

        return;
    }

    connection.on('updateSignInStats', updateObj => {
        if (!updateObj || !updateObj.totalNumber) return;

        store.dispatch({
            type: receiveSignInStats,
            signIns: updateObj.totalNumber
        });

        console.log('updateSignInStats received');
    });

    connection.on('updateAnalyzeTweetsStats', (totalText, totalPicture) => {
        if (!totalText || !totalPicture) return;

        store.dispatch({
            type: receiveAnalyzeStats,
            text: totalText,
            pictures: totalPicture
        });

        console.log('updateAnalyzeTweetsStats received');
    });

    connection.on('updateFetchTweetsStats', (totalNumber, usernames) => {
        if (!totalNumber || !usernames) return;

        store.dispatch({
            type: receiveFetchStats,
            tweetsFetched: totalNumber,
            usernames: usernames
        });

        console.log('updateAnalyzeTweetsStats received');
    });

    connection.onclose(() => {
        store.dispatch({
            type: signOut
        });
    });

    connection.start().then(() => {
        store.dispatch({
            type: receiveSignIn
        });
    }).catch(() => {
        store.dispatch({
            type: signInError
        });
    });
}
