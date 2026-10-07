import CopyButton from "./CopyButton";

function UrlHistory({ history, error, onRefresh, copiedButton, onCopied }) {
  return (
    <section className="card app-card border-0 mt-4">
      <div className="card-body p-4 p-md-5">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
          <div>
            <p className="eyebrow mb-1">YOUR LINKS</p>
            <h2 className="section-title h4 mb-0">History</h2>
          </div>
          <button className="btn btn-outline-primary" type="button" onClick={onRefresh}>
            Refresh History
          </button>
        </div>

        {error && <div className="alert alert-danger" role="alert">{error}</div>}

        {history.length === 0 && !error && (
          <p className="empty-state mb-0">ยังไม่มี Short URL ที่สร้างไว้</p>
        )}

        <div className="history-list">
          {history.map((url) => (
            <article className="history-item" key={url._id}>
              <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-3">
                <img
                  className="history-qr"
                  src={url.qrCode}
                  alt={`QR Code ของ ${url.shortUrl}`}
                  loading="lazy"
                />
                <div className="flex-grow-1">
                  <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                    <a className="history-code" href={url.shortUrl}>
                      {url.shortUrl}
                    </a>
                    <CopyButton
                      text={url.shortUrl}
                      copyKey={`history-${url._id}`}
                      copiedButton={copiedButton}
                      onCopied={onCopied}
                    />
                    <span className="badge rounded-pill text-bg-light click-count ms-auto">{url.clickCount} clicks</span>
                  </div>
                  <p className="history-original small text-break mb-2">Original: {url.originalUrl}</p>
                  <p className="history-date small text-secondary mb-0">
                    created {new Date(url.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default UrlHistory;
