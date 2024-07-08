const fetchAvailableComponents = async (token, workplaceId) => {
    if (!token.startsWith('eyJhbGciOiJIUzI1NiJ9')) {
        return { status: 401 };
    } else if (!workplaceId) {
        return { status: 400, text: 'Workplace ID is required' };
    } else {
        const exampleResponse = JSON.stringify([{ name: 'Component1' }, { name: 'Component2' }]);
        return { status: 200, text: exampleResponse };
    }
};

module.exports = { fetchAvailableComponents };
