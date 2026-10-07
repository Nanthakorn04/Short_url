import { useCallback, useEffect, useState } from "react";
import "./App.css";
import CreateUrlForm from "./components/CreateUrlForm";
import PasswordForm from "./components/PasswordForm";
import UrlHistory from "./components/UrlHistory";
import UrlResult from "./components/UrlResult";

function App() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(null);
  const [copiedButton, setCopiedButton] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyError, setHistoryError] = useState("");
  const [accessPassword, setAccessPassword] = useState("");
  const [accessError, setAccessError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const pathParts = window.location.pathname.split("/").filter(Boolean);
  const shortCodeForPasswordPage =
    pathParts[0] === "password" ? pathParts[1] : "";

  async function handleVerifyPassword(event) {
    event.preventDefault();
    setAccessError("");
    setIsVerifying(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/${shortCodeForPasswordPage}/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: accessPassword }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "ตรวจสอบ Password ไม่สำเร็จ");
      }

      window.location.href = data.redirectUrl;
    } catch (error) {
      setAccessError(error.message);
    } finally {
      setIsVerifying(false);
    }
  }

  const handleLoadHistory = useCallback(async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/urls/history`,
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "โหลด History ไม่สำเร็จ");
      }

      setHistoryError("");
      setHistory(data);
    } catch (error) {
      setHistoryError(error.message);
    }
  }, []);

  useEffect(() => {
    if (!shortCodeForPasswordPage) {
      // Load remote History on page entry; state updates happen after the request resolves.
      // oxlint-disable-next-line react/set-state-in-effect
      handleLoadHistory();
    }
  }, [handleLoadHistory, shortCodeForPasswordPage]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setResult(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/urls`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ originalUrl, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "สร้าง Short URL ไม่สำเร็จ");
      }

      setResult(data);
      setPassword("");
      await handleLoadHistory();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }
 

  if (shortCodeForPasswordPage) {
    return (
      <main className="app-shell container min-vh-100 d-flex align-items-center justify-content-center py-5">
        <div className="password-page w-100">
          <header className="app-header text-center mb-4">
            <p className="eyebrow mb-2">URL SHORTENER</p>
            <h1 className="display-title">ลิงก์นี้ต้องใช้ Password</h1>
            <p className="text-secondary mb-0">กรอกรหัสผ่านเพื่อไปยังปลายทาง</p>
          </header>
          <PasswordForm
            password={accessPassword}
            onPasswordChange={setAccessPassword}
            onSubmit={handleVerifyPassword}
            error={accessError}
            isVerifying={isVerifying}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="app-shell container py-5">
      <header className="app-header text-center mb-5">
        <p className="eyebrow mb-2">LINKS MADE SIMPLE</p>
        <h1 className="display-title">URL Shortener</h1>
        <p className="text-secondary mb-0">Create short links and manage your history</p>
      </header>

      <div className="content-column mx-auto">
        <CreateUrlForm
          originalUrl={originalUrl}
          onOriginalUrlChange={setOriginalUrl}
          password={password}
          onPasswordChange={setPassword}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />

        {error && <div className="alert alert-danger mt-3" role="alert">{error}</div>}

        <UrlResult
          result={result}
          copiedButton={copiedButton}
          onCopied={setCopiedButton}
        />

        <UrlHistory
          history={history}
          error={historyError}
          onRefresh={handleLoadHistory}
          copiedButton={copiedButton}
          onCopied={setCopiedButton}
        />
      </div>
    </main>
  );
}

export default App;
