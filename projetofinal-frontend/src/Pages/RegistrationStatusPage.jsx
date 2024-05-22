import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RegistrationConfirmation from "../Components/RegistrationConfirmation";

function RegistrationStatusPage() {
    const navigate = useNavigate();
    const { emailToken } = useParams();
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        if (emailToken) {
            confirmRegistration(emailToken).then(setSuccess);
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

async function confirmRegistration(emailToken) {
    try {
        const response = await fetch('http://localhost:8080/projetofinal-backend-1.0-SNAPSHOT/rest/users/confirmRegistration', {
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
