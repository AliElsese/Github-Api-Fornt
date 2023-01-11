import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// env
import environment from "../../env";

// Third Part Library
import axios from "axios";

// enums
import { USER_INFO, USER_TOKEN } from "../../core/enums/auth-keys";

// CSS File
import "../../core/css/register.css";

function Signup() {
  //
  const Navigate = useNavigate();

  // States
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [passwordConfirm, setPasswordConfirm] = useState(null);

  function submit() {
    if (name && email && password && passwordConfirm) {
      setErrors([]);
      setLoading(true);
      axios
        .post(`${environment.API_URL}/auth/signup`, {
          name,
          email,
          password,
          passwordConfirm,
        })
        .then((res) => {
          const {
            data: { data, token },
          } = res || {};

          //
          localStorage.setItem(USER_TOKEN, token);
          localStorage.setItem(USER_INFO, JSON.stringify(data));

          //
          Navigate("/home");

          // stop Lading
          setLoading(false);
        })
        .catch((err) => {
          const {
            response: {
              data: { errors },
            },
          } = err || {};
          setLoading(false);
          setErrors(errors || []);
        });
    }
  }

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-lg-4 col-md-6 col-sm-6">
          <div className="card shadow">
            <div className="card-title text-center border-bottom">
              <h2 className="p-3">Signup</h2>
            </div>
            <div className="card-body">
              <form>
                <div className="mb-4">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    onInput={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    onInput={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    onInput={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="passwordConfirm"
                    onInput={(e) => setPasswordConfirm(e.target.value)}
                  />
                </div>
                {passwordConfirm && passwordConfirm !== password && (
                  <div className="mb-4">
                    <div className="invalid-feedback d-block">
                      Password Not Match With Confirm Password
                    </div>
                  </div>
                )}
                {errors.map((err, index) => (
                  <div className="mb-2" key={index}>
                    <div className="invalid-feedback d-block">{err?.msg}</div>
                  </div>
                ))}
                <div className="mb-4">
                  <Link to="/login">
                    <span>Have an account</span>
                  </Link>
                </div>
                <div className="d-grid">
                  <button
                    type="button"
                    className="btn text-light bg-primary"
                    onClick={() => submit()}
                    disabled={loading || passwordConfirm !== password}
                  >
                    Signup
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
