export const fetchData = async (url, queryParams = null) => {
    const fullUrl = url + (queryParams === null ? "" :
        '?' + Object.entries(queryParams).map((key, value) => key + '=' + value).join('&'));

    return call(fullUrl)
}

export const postData = async (url, requestBody = {}, userId = null) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
    };

    if (userId !== null) requestOptions.headers['user_id'] = userId;

    return call(url, requestOptions);
};

const call = async (url, requestOptions = undefined) => {
    const state = {
        data: null,
        error: false,
        errorReason: null,
        retries: 0
    };

    return callHelper(state, url, requestOptions)
};

const callHelper = async (state, url, requestOptions = undefined, retries = 0, maxRetries = 3) => {
    state.retries = retries;
    try {
        const response = await fetch(url, requestOptions);
        state.data = await response.json();
    } catch (error) {
        if (retries < maxRetries) return callHelper(state, url, requestOptions, retries + 1, maxRetries);
        state.error = true;
        state.errorReason = error.message
    }

    return state;
}