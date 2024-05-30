import { useState } from 'react';


export default function useForm(initialState) {
    const [values, setValues] = useState(initialState);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((prevValues) => ({
        ...prevValues,
        [name]: value,
        }));
    };

    return [values, handleChange];
}