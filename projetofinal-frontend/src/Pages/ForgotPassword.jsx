// Pages/ForgotPassword.js

import React, { useState } from "react";
import { Button, Card, Label, TextInput, Spinner, Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import { useParams, useNavigate } from "react-router-dom";
import useForm from "../Hooks/useForm";
import { resetPassword } from "../Services/apiService";

function ForgotPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [passwordStrengthWarning, setPasswordStrengthWarning] = useState(false);
  const [formValues, handleChange] = useForm({ password: '', confirmPassword: '' });

  const isStrongPassword = (password) => {
    const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    return passwordPattern.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = formValues;

    if (password !== confirmPassword) {
      setShowWarning(true);
      return;
    }

    if (!isStrongPassword(password)) {
      setPasswordStrengthWarning(true);
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, password);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error resetting password:', error);
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="max-w-sm">
        <h1 className="text-3xl font-bold text-center mb-6">New Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="password" value="Password" />
            <TextInput
              id="password"
              name="password"
              type="password"
              placeholder="Your new password"
              value={formValues.password}
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
              value={formValues.confirmPassword}
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
