import React from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Button } from "flowbite-react";
import { useTranslation } from "react-i18next";

function RegistrationConfirmation({ success, onConfirm }) { 
    const { t } = useTranslation(); //tradução
    return (
        <div className="min-h-screen flex flex-col justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
                {success ? (
                    <React.Fragment>
                        <h2 className="text-2xl font-bold mb-4">{t('Registration')}</h2>
                        <p className="text-gray-700 mb-6">{t('Yourregistrationwassuccessful!')}</p>
                        <FaCheckCircle className="text-green-500 text-6xl mb-6 mx-auto" />
                        
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <h2 className="text-2xl font-bold mb-4">{t('Registration Failed')}</h2>
                        <p className="text-red-500 mb-6">{t('Unsuccefull registration. Please try again.')}</p>
                        <FaTimesCircle className="text-red-500 text-6xl mb-6 mx-auto" />
                        <div className="flex justify-center">
                </div>
                    </React.Fragment>
                )}
                <div className="flex justify-center">
                    <Button
                        onClick={onConfirm}
                        transition="duration-300"
                    >
                        {t('Continue')}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default RegistrationConfirmation;
