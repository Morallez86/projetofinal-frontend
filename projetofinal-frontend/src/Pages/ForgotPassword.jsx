import {
    Button,
    Card,
    Label,
    TextInput,
    Spinner,
    Alert,
} from "flowbite-react";
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { HiInformationCircle } from "react-icons/hi";

function ForgotPassword() {
    const [showWarning, setShowWarning] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordStrengthWarning, setPasswordStrengthWarning] = useState(false);
    const navigate = useNavigate();
    const { token } = useParams();
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === "password") {
            setPassword(value);
            setPasswordStrengthWarning(!isStrongPassword(value));
        } else if (name === "confirmPassword") {
            setConfirmPassword(value);
        }
        setShowWarning(false); // Hide warning when user types
    };

    const isStrongPassword = (password) => {
        const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        return passwordPattern.test(password);
    };

    const handleAccountRegistration = async (event) => {
    event.preventDefault(); // Prevent default form submission
    if (password !== confirmPassword) {
        setShowWarning(true);
        return;
    }
    if (!isStrongPassword(password)) {
        setPasswordStrengthWarning(true);
        return;
    }
    console.log(1);
    console.log(token);
    console.log(password);
    setLoading(true);
    try {
        const response = await fetch('http://localhost:8080/projetofinal-backend-1.0-SNAPSHOT/rest/users/forgotPassword', {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'PUT',
            body: JSON.stringify({ token, password }),
        });
        await response.json();
        if (response.status === 200) {
            navigate('/', { replace: true });
        }
        } catch (error) {
        console.error('Error confirming registration:', error);
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
        <Card className="max-w-sm">
            <h1 className="text-3xl font-bold text-center mb-6">New Password</h1>
            <form onSubmit={handleAccountRegistration}>
            <div className="mb-4">
                <Label htmlFor="password" value="Password" />
                <TextInput
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Your new password"
                    value={password}
                    onChange={handleChange}
                    className="peer"
                />
            </div>
            <div className="mb-4">
                <Label htmlFor="confirmPassword" value="Confirm Password" />
                <TextInput
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={handleChange}
                    className="peer"
                />
            </div>
            {passwordStrengthWarning && (
                <Alert color="failure" icon={HiInformationCircle} className="mb-4">
                <span>
                    Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.
                </span>
                </Alert>
            )}
            {showWarning && (
                <Alert color="failure" icon={HiInformationCircle} className="mb-4">
                    <span>Password and confirmed password are not the same</span>
                </Alert>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Spinner size="sm" /> : "Change Password"}
            </Button>
            </form>
        </Card>
        </div>
    );
}

export default ForgotPassword;
