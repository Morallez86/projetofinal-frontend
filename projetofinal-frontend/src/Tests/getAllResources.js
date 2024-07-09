const fetchGetAllResources = async () => {
    if (!token.startsWith('eyJhbGciOiJIUzI1NiJ9')) {
        return { status: 401 };
    }
    else {
        const exampleResponse = JSON.stringify([{ name: 'Resource1' }, { name: 'Resource2' }]);
        return { status: 200, text: exampleResponse };
    }
}

module.exports = { fetchGetAllResources };