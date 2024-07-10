import { useState, useEffect } from 'react';
import { confirmRegistration } from '../Services/apiService';

export default function useConfirmRegistration(emailToken, apiUrl) {
    const [success, setSuccess] = useState(null); // sucesso

    useEffect(() => { // useEffect
        if (emailToken) { // se o token do email existir
            confirmRegistration(emailToken, apiUrl).then(setSuccess);
        } else {
            setSuccess(false);
        }
    }, [emailToken, apiUrl]); // dependências

    return success;
}
