import CopyButton from "./CopyButton";

function UrlResult({ result, copiedButton, onCopied }) {
  if (!result) {
    return null;
  }

  return (
    <section className="card result-card border-0 mt-4" aria-live="polite">
      <div className="card-body p-4 p-md-5 text-center">
        <span className="success-mark" aria-hidden="true">✓</span>
        <p className="eyebrow mt-3 mb-1">LINK READY</p>
        <h2 className="section-title h4 mb-3">สร้าง Short URL สำเร็จ</h2>
        <div className="d-flex flex-wrap justify-content-center align-items-center gap-2 mb-4">
          <a className="short-url-link" href={result.shortUrl}>
            {result.shortUrl}
          </a>
          <CopyButton
            text={result.shortUrl}
            copyKey={`result-${result.shortCode}`}
            copiedButton={copiedButton}
            onCopied={onCopied}
          />
        </div>
        <div>
          <img className="qr-image img-fluid" src={result.qrCode} alt="QR Code ของ Short URL" />
        </div>
      </div>
    </section>
  );
}

export default UrlResult;
