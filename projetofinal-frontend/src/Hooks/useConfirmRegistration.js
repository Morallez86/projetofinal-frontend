import { useState, useEffect } from 'react';
import { confirmRegistration } from '../Services/apiService';

export default function useConfirmRegistration(emailToken, apiUrl) {
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        if (emailToken) {
            confirmRegistration(emailToken, apiUrl).then(setSuccess);
        } else {
            setSuccess(false);
        }
    }, [emailToken, apiUrl]);

    return success;
}
