
import React from "react";
import { Alert, Button, Card, Label, Spinner, TextInput } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import useUserStore from "../Stores/UserStore";
import useApiStore from "../Stores/ApiStore";
import useForm from "../Hooks/useForm";
import useChangePassword from "../Hooks/useChangePassword";

function MyProfileChangePassword() {
  const { token } = useUserStore();
  const apiUrl = useApiStore((state) => state.apiUrl);
  const [formValues, handleChange] = useForm({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
  const { loading, passwordStrengthWarning, showWarning, handleChangePassword } = useChangePassword(apiUrl, token);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmNewPassword } = formValues;
    const success = await handleChangePassword(oldPassword, newPassword, confirmNewPassword);
    if (success) {
      alert("Password updated successfully");
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center">
      <div className="p-14">
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
                value={formValues.oldPassword}
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
                value={formValues.newPassword}
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
                value={formValues.confirmNewPassword}
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
