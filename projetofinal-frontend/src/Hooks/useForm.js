import { useState } from 'react';


export default function useForm(initialState) {
    const [values, setValues] = useState(initialState); // valores

    const handleChange = (e) => { // função para mudar os valores
        const { name, value } = e.target;
        setValues((prevValues) => ({
        ...prevValues,
        [name]: value,
        }));
    };

    return [values, handleChange];
}