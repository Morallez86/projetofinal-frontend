
export async function confirmRegistration(emailToken, apiUrl) { // função para confirmar o registo
    try {
        const response = await fetch(`${apiUrl}/users/confirmRegistration`, { // fetch para confirmar o registo
            method: 'GET',
            headers: {
                'emailToken': emailToken
            }
        });

        if (response.status === 200) { // se o status for 200
            
            return true;
        } else { // se não
            
            return false;
        }
    } catch (error) {
        console.error('Error confirming registration:', error);
        return false;
    }
}

export async function updatePassword(apiUrl, token, oldPassword, newPassword) { // função para atualizar a password
    try {
        const response = await fetch(`${apiUrl}/users/updatePassword`, { 
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
        });

        if (!response.ok) { // se a resposta não for ok
            const errorData = await response.json();
            throw new Error(errorData.message);
        }

        return true;
    } catch (error) { // erro
        console.error("Error updating password", error);
        throw error;
    }
}

export async function resetPassword(apiUrl, token, password) { // função para resetar a password
    try {
        const response = await fetch(`${apiUrl}/users/forgotPassword`, { 
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'PUT',
            body: JSON.stringify({ token, password }),
        });
        if (response.status === 200) { // se o status for 200
            return true;
        } else { // se não
            throw new Error('Failed to reset password');
        }
    } catch (error) {
        console.error('Error resetting password:', error);
        throw error;
    }
}


