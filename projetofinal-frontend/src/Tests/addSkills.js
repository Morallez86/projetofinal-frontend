const fetchAddSkills = async (skills) => {
    if (!token.startsWith('eyJhbGciOiJIUzI1NiJ9')) {
        return { status: 401 };
    }
    else {
        const exampleResponse = JSON.stringify(skills);
        return { status: 200, text: exampleResponse };
    }
};

module.exports = { fetchAddSkills };
        