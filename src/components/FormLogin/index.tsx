import React, { useState } from "react";
import firebaseService from "../../services/FirebaseService";
import { FcGoogle } from "react-icons/fc";
import { MdCheck, MdPersonAdd } from "react-icons/md";
import "./styles.scss";

export const FormLogin: React.FC = () => {
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const signWithGoogle = () => {
    firebaseService.signInGoogle().catch((err) => {
      setError(`${err?.message}`.replace("Firebase:", ""));
    });
  };

  const signWithEmail = () => {
    const { email, password } = form;
    if (email && password) {
      firebaseService.signInEmail(email, password).catch((err) => {
        setError(`${err?.message}`.replace("Firebase:", ""));
      });
    } else {
      setError("Email e senha obrigatórios");
    }
  };

  const registerWithEmail = () => {
    const { email, password } = form;
    if (email && password) {
      firebaseService.createUserWithEmail(email, password).catch((err) => {
        setError(`${err?.message}`.replace("Firebase:", ""));
      });
    } else {
      setError("Email e senha obrigatórios");
    }
  };

  const handleChange = (e: any) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="form-container">
      <div className="title">
        <h4>Login</h4>
      </div>

      <div className="buttons">
        <div className="btn-google">
          <button onClick={signWithGoogle}>
            <FcGoogle /> Login Google
          </button>
        </div>
        <p>Ou</p>
      </div>

      <div className="form">
        <div className="input-block">
          <input
            name="email"
            type="email"
            id="login-email"
            placeholder="Email"
            onChange={handleChange}
          />
        </div>
        <div className="input-block">
          <input
            name="password"
            type="password"
            id="login-password"
            placeholder="Senha"
            onChange={handleChange}
          />
        </div>
        <div className="error">
          <p>{error}</p>
        </div>
      </div>

      <div className="buttons">
        <div className="btn-enter">
          <button onClick={signWithEmail}>
            <MdCheck /> Entrar
          </button>
        </div>
        <div className="btn-register">
          <button onClick={registerWithEmail}>
            <MdPersonAdd /> Fazer Cadastro
          </button>
        </div>
      </div>
    </div>
  );
};
