
export async function confirmRegistration(emailToken, apiUrl) {
    try {
        const response = await fetch(`${apiUrl}/users/confirmRegistration`, {
            method: 'GET',
            headers: {
                'emailToken': emailToken
            }
        });

        if (response.status === 200) {
            console.log(emailToken)
            return true;
        } else {
            console.log(emailToken)
            return false;
        }
    } catch (error) {
        console.error('Error confirming registration:', error);
        return false;
    }
}

export async function updatePassword(apiUrl, token, oldPassword, newPassword) {
    try {
        const response = await fetch(`${apiUrl}/rest/users/updatePassword`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }

        return true;
    } catch (error) {
        console.error("Error updating password", error);
        throw error;
    }
}

export async function resetPassword(apiUrl, token, password) {
    try {
        const response = await fetch(`${apiUrl}/users/forgotPassword`, {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'PUT',
            body: JSON.stringify({ token, password }),
        });
        if (response.status === 200) {
            return true;
        } else {
            throw new Error('Failed to reset password');
        }
    } catch (error) {
        console.error('Error resetting password:', error);
        throw error;
    }
}


