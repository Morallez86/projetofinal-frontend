// Hooks/useChangePassword.js

import { useState } from "react";
import zxcvbn from "zxcvbn";
import { updatePassword } from "../Services/apiService";

export default function useChangePassword(apiUrl, token) {
    const [loading, setLoading] = useState(false); // loading
    const [passwordStrengthWarning, setPasswordStrengthWarning] = useState(false); // aviso de força da password
    const [showWarning, setShowWarning] = useState(false); // mostrar aviso

    const handleChangePassword = async (oldPassword, newPassword, confirmNewPassword) => { // função para mudar a password
        setLoading(true);

        const passwordStrength = zxcvbn(newPassword);
        if (passwordStrength.score < 3) { // se a força da password for menor que 3
        setPasswordStrengthWarning(true);
        setLoading(false);
        return false;
        }

        setPasswordStrengthWarning(false);
        if (newPassword !== confirmNewPassword) { // se a nova password for diferente da confirmação
        setShowWarning(true); 
        setLoading(false);
        return false;
        }

        setShowWarning(false);
        try {
        await updatePassword(apiUrl, token, oldPassword, newPassword);
        return true;
        } catch (error) {
        alert(`Failed to update password: ${error.message}`);
        return false;
        } finally {
        setLoading(false);
        }
    };

    return {
        loading,
        passwordStrengthWarning,
        showWarning,
        handleChangePassword,
    };
}
