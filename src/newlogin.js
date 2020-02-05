import React from "react";
import { useStatefulFields } from "./hooks/useStatefulFields";
import { useAuthSubmit } from "./useAuthSubmit";

export default function Login() {
    const [values, handleChange] = useStatefulFields();
    const [error, handleSubmit] = useAuthSubmit("/login", values);
    return (
        <form>
            {error && <p> something broke = not clutch :( )</p>}
            <input name="email" type="text" onChange={handleChange} />
            <input name="password" type="password" onChange={handleChange} />
            <button onClick={handleSubmit}> submit</button>
        </form>
    );
}
