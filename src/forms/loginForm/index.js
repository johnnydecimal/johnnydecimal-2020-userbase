import React from "react";

import { useForm } from "react-hook-form";

export default function LoginForm() {
  const { register, handleSubmit, watch, errors } = useForm();

  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        name="username"
        defaultValue="user@example.com"
        ref={register({ required: true })}
      />
      <input
        name="password"
        type="password"
        ref={register({ required: true })}
      />
      {errors.passwordRequired && <span>A password is required.</span>}
      <input type="submit" />
    </form>
  );
}
