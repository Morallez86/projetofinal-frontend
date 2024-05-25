import React, { useState } from "react";
import { Alert, Button, Card, Label, Spinner, TextInput } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import Layout from "../Components/Layout";
import useUserStore from "../Stores/UserStore";
import zxcvbn from "zxcvbn";

function MyProfileChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrengthWarning, setPasswordStrengthWarning] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const { token } = useUserStore();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "oldPassword") {
      setOldPassword(value);
    } else if (name === "newPassword") {
      setNewPassword(value);
    } else if (name === "confirmNewPassword") {
      setConfirmNewPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check password strength using zxcvbn
    const passwordStrength = zxcvbn(newPassword);

    if (passwordStrength.score < 3) {
      setPasswordStrengthWarning(true);
      setLoading(false);
      return;
    } else {
      setPasswordStrengthWarning(false);
    }

    if (newPassword !== confirmNewPassword) {
      setShowWarning(true);
      setLoading(false);
      return;
    } else {
      setShowWarning(false);
    }

    try {
      const response = await fetch("http://localhost:8080/projetofinal-backend-1.0-SNAPSHOT/rest/users/updatePassword", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      if (response.ok) {
        alert("Password updated successfully");
      } else {
        const errorData = await response.json();
        alert(`Failed to update password: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error updating password", error);
      alert("Error updating password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Layout activeTab={0} activeSubTabProfile={1} />
      <div className="flex-grow flex justify-center items-center">
        <Card className="max-w-sm w-full mx-4">
          <h1 className="text-3xl font-bold text-center mb-6">Change Password</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="oldPassword" value="Old Password" />
              <TextInput
                id="oldPassword"
                name="oldPassword"
                type="password"
                placeholder="Your old password"
                value={oldPassword}
                onChange={handleChange}
                className="peer"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="newPassword" value="New Password" />
              <TextInput
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder="Your new password"
                value={newPassword}
                onChange={handleChange}
                className="peer"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="confirmNewPassword" value="Confirm New Password" />
              <TextInput
                id="confirmNewPassword"
                name="confirmNewPassword"
                type="password"
                placeholder="Confirm your new password"
                value={confirmNewPassword}
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
                <span>Password and confirmed password do not match</span>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Spinner size="sm" /> : "Change Password"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default MyProfileChangePassword;
