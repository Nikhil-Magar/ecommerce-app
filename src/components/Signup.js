import React from 'react'

export default function Signup() {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm mt-5">
            <div className="card-body p-4">
              <h2 className="card-title text-center mb-4">Sign Up</h2>
              
              <form>
                <div className="mb-3">
                  <label htmlFor="emailInput" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="emailInput"
                    placeholder="name@example.com"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="passwordInput" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="passwordInput"
                    placeholder="Enter your password"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmPasswordInput" className="form-label">
                    Re-enter Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPasswordInput"
                    placeholder="Re-enter your password"
                  />
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Register
                  </button>
                </div>
              </form>

              <div className="text-center mt-3">
                <small className="text-muted">
                  Already have an account? <a href="/login">Login</a>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}