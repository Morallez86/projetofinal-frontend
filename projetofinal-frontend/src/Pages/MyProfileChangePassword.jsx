
import React from "react";
import { Alert, Button, Card, Label, Spinner, TextInput } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import useUserStore from "../Stores/UserStore";
import useApiStore from "../Stores/ApiStore";
import useForm from "../Hooks/useForm";
import useChangePassword from "../Hooks/useChangePassword";
import { useTranslation } from "react-i18next";


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

  const {t} = useTranslation();

  return (
    <div className="flex flex-col min-h-screen items-center">
      <div className="p-14">
        <Card className="max-w-sm w-full mx-4 border-gray-600 bg-gradient-to-r from-gray-400 via-gray-50 to-white rounded-lg">
          <h1 className="text-3xl font-bold text-center mb-6">
            {t("ChangePassword")}
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label
                htmlFor="oldPassword"
                value= {t("ActualPassword")}
                className="font-semibold text-base"
              />
              <TextInput
                id="oldPassword"
                name="oldPassword"
                type="password"
                placeholder={t('YourActualPassword')}
                value={formValues.oldPassword}
                onChange={handleChange}
                className="peer"
              />
            </div>
            <div className="mb-4">
              <Label
                htmlFor="newPassword"
                value={t("NewPassword")}
                className="font-semibold text-base"
              />
              <TextInput
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder={t('YourNewPassword')}
                value={formValues.newPassword}
                onChange={handleChange}
                className="peer"
              />
            </div>
            <div className="mb-4">
              <Label
                htmlFor="confirmNewPassword"
                value={t("ConfirmNewPassword")}
                className="font-semibold text-base"
              />
              <TextInput
                id="confirmNewPassword"
                name="confirmNewPassword"
                type="password"
                placeholder={t('ConfirmYourNewPassword')}
                value={formValues.confirmNewPassword}
                onChange={handleChange}
                className="peer"
              />
            </div>
            {passwordStrengthWarning && (
              <Alert
                color="failure"
                icon={HiInformationCircle}
                className="mb-4"
              >
                <span>
                 {t("PasswordStrengthWarning")}
                </span>
              </Alert>
            )}
            {showWarning && (
              <Alert
                color="failure"
                icon={HiInformationCircle}
                className="mb-4"
              >
                <span> {t('PasswordMatchWarning')} </span>
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
