import { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // @ts-ignore
    const result = await window.profileDB?.signIn({ emailAddress, password });

    if (result?.error) {
      return;
    }

    navigate(from, { replace: true });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">email</label>
        <input
          onChange={({ target: { value } }) => setEmailAddress(value)}
          id="email"
          required
          type="email"
          value={emailAddress}
        />
      </div>
      <div>
        <label htmlFor="password">password</label>
        <input
          onChange={({ target: { value } }) => setPassword(value)}
          id="password"
          required
          type="password"
          value={password}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );
}
