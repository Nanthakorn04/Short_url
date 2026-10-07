function CreateUrlForm({
  originalUrl,
  onOriginalUrlChange,
  password,
  onPasswordChange,
  onSubmit,
  isSubmitting,
}) {
  return (
    <section className="card app-card border-0">
      <div className="card-body p-4 p-md-5">
        <h2 className="section-title h4 mb-4">Create Short URL</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label" htmlFor="originalUrl">Original URL</label>
            <input
              className="form-control form-control-lg"
              id="originalUrl"
              type="url"
              value={originalUrl}
              onChange={(event) => onOriginalUrlChange(event.target.value)}
              placeholder="https://"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label" htmlFor="password">Password (optional)</label>
            <input
              className="form-control"
              id="password"
              type="password"
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              placeholder="Choose a password"
            />
            <div className="form-text">Set a password to protect the link</div>
          </div>

          <button className="btn btn-primary btn-lg w-100" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Short URL"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default CreateUrlForm;
