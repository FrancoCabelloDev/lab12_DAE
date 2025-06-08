import { useNavigate } from "react-router-dom";
import '../App.css';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/series");
  };

  return (
    <section className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="container">
        <div className="row justify-content-sm-center">
          <div className="col-xxl-4 col-xl-5 col-lg-5 col-md-7 col-sm-9">
            <div className="card shadow-lg">
              <div className="card-body p-5">
                <h1 className="fs-4 card-title fw-bold mb-4">Login</h1>
                <form onSubmit={handleSubmit} autoComplete="off">
                  <div className="mb-3">
                    <label htmlFor="email" className="mb-2 text-muted">E-Mail</label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      className="form-control"
                      required
                      autoFocus
                    />
                  </div>

                  <div className="mb-3">
                    <div className="mb-2 d-flex justify-content-between">
                      <label htmlFor="password" className="text-muted">Contraseña</label>
                      <a href="forgot.html">¿Recuperar Contraseña?</a>
                    </div>
                    <input
                      id="password"
                      type="password"
                      name="password"
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="d-flex align-items-center">
                    <div className="form-check">
                      <input
                        id="remember"
                        type="checkbox"
                        name="remember"
                        className="form-check-input"
                      />
                      <label htmlFor="remember" className="form-check-label">Recordarme</label>
                    </div>
                    <button type="submit" className="btn btn-primary ms-auto">
                      Ingresar
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="text-center mt-5 text-muted">
              &copy; Tecsup 2024
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
