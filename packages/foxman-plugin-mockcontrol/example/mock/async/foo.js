module.exports = function (data, request) {
    console.log(request.query)
    console.log(request.body)
    console.log(data)
    
    if (request.query.title) {
        return {
            hello: 'world1'
        }
    }

    if (request.body.title) {
        return {
            hello: 'world2'
        }
    }

    return {
        hello: 'world3'
    }
}