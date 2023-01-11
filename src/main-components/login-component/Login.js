import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// env
import environment from "../../env";

// Third Part Library
import axios from "axios";

// enmus
import { USER_INFO, USER_TOKEN } from "../../core/enums/auth-keys";

// CSS File
import "../../core/css/register.css";

function Login() {
  //
  const Navigate = useNavigate();

  // States
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  function submit() {
    setErrors([]);
    setLoading(true);
    axios
      .post(`${environment.API_URL}/auth/login`, { email, password })
      .then((res) => {
        let {
          data: {
            data: { user, savedRepos },
            token,
          },
        } = res || {};

        savedRepos = savedRepos?.map((repo) => repo?.repoid);
        
        //
        localStorage.setItem(USER_TOKEN, token);
        localStorage.setItem(USER_INFO, JSON.stringify({ user, savedRepos }))
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

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-lg-4 col-md-6 col-sm-6">
          <div className="card shadow">
            <div className="card-title text-center border-bottom">
              <h2 className="p-3">Login</h2>
            </div>
            <div className="card-body">
              <form>
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
                {errors.map((err, index) => (
                  <div className="mb-2" key={index}>
                    <div className="invalid-feedback d-block">{err?.msg}</div>
                  </div>
                ))}
                <div className="mb-4">
                  <Link to="/signup">
                    <span>Create an account</span>
                  </Link>
                </div>
                <div className="d-grid">
                  <button
                    type="button"
                    className="btn text-light bg-primary"
                    onClick={() => submit()}
                    disabled={loading}
                  >
                    Login
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

export default Login;
