import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RegistrationConfirmation from "../Components/RegistrationConfirmation";
import useApiStore from '../Stores/ApiStore';

function RegistrationStatusPage() {
    const apiUrl = useApiStore((state) => state.apiUrl);
    const navigate = useNavigate();
    const { emailToken } = useParams();
    const [success, setSuccess] = useState(null);
    

    useEffect(() => {
        if (emailToken) {
            confirmRegistration(emailToken, apiUrl).then(setSuccess);
        } else {
            setSuccess(false);
        }
    }, [emailToken]);

    const handleConfirm = () => {
        navigate("/");
    };

    return (
        success !== null && (
            <RegistrationConfirmation
                success={success}
                onConfirm={handleConfirm}
            />
        )
    );
}

async function confirmRegistration(emailToken, apiUrl) {
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

export default RegistrationStatusPage;
