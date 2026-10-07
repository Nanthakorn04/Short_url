function PasswordForm({
  password,
  onPasswordChange,
  onSubmit,
  error,
  isVerifying,
}) {
  return (
    <section className="card app-card border-0">
      <div className="card-body p-4 p-md-5">
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="form-label" htmlFor="accessPassword">Password</label>
            <input
              className="form-control form-control-lg"
              id="accessPassword"
              type="password"
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button className="btn btn-primary btn-lg w-100" type="submit" disabled={isVerifying}>
            {isVerifying ? "กำลังตรวจสอบ..." : "เปิดลิงก์"}
          </button>
        </form>

        {error && <div className="alert alert-danger mt-3 mb-0" role="alert">{error}</div>}
      </div>
    </section>
  );
}

export default PasswordForm;
