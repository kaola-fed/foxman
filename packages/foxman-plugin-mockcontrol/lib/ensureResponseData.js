module.exports = function ensureResponseData ({hasJson, parsedData}) {
    let responseData;

    if (!hasJson) {
        responseData = {};
    } else {
        responseData = parsedData;
    }

    return responseData;
};
