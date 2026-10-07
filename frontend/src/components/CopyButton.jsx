import { useState } from "react";

function CopyButton({ text, copyKey, copiedButton, onCopied }) {
  const [hasError, setHasError] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setHasError(false);
      onCopied(copyKey);
    } catch {
      setHasError(true);
    }
  }

  return (
    <span className="copy-control">
      <button
        className="btn btn-outline-secondary btn-sm"
        type="button"
        onClick={handleCopy}
      >
        {copiedButton === copyKey ? "คัดลอกแล้ว" : "คัดลอก"}
      </button>
      {hasError && (
        <span className="copy-error" role="alert">
          คัดลอกไม่สำเร็จ
        </span>
      )}
    </span>
  );
}

export default CopyButton;
