import React, { useEffect, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function App() {
  const [step, setStep] = useState(1);

  // username/password
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // options
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [rememberUsername, setRememberUsername] = useState(true);

  // UI states
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // login success page
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // forgot password page
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotUsername, setForgotUsername] = useState("");

  // caps lock warning
  const [capsLockOn, setCapsLockOn] = useState(false);

  // account lock feature
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);

  //  Load remembered username
  useEffect(() => {
    const savedUsername = localStorage.getItem("rememberedUsername");
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  //  Store username whenever it changes (only if rememberUsername enabled)
  useEffect(() => {
    if (rememberUsername && username.trim()) {
      localStorage.setItem("rememberedUsername", username.trim());
    }
  }, [username, rememberUsername]);

  //  Lock countdown timer
  useEffect(() => {
    let interval;

    if (isLocked && lockTimer > 0) {
      interval = setInterval(() => {
        setLockTimer((prev) => prev - 1);
      }, 1000);
    }

    if (isLocked && lockTimer === 0) {
      setIsLocked(false);
      setAttempts(0);
      setError("");
    }

    return () => clearInterval(interval);
  }, [isLocked, lockTimer]);

  const handleRememberUsername = (checked) => {
    setRememberUsername(checked);

    if (!checked) {
      localStorage.removeItem("rememberedUsername");
    } else {
      if (username.trim()) {
        localStorage.setItem("rememberedUsername", username.trim());
      }
    }
  };

  const handleNext = () => {
    if (!username.trim()) {
      setError("Enter a valid username.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleBack = () => {
    setError("");
    setPassword("");
    setShowPassword(false);
    setCapsLockOn(false);
    setStep(1);
  };

  const handleSignIn = (e) => {
    e.preventDefault();

    if (isLocked) {
      setError(`Account locked. Try again in ${lockTimer}s.`);
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    setError("");
    setIsLoading(true);

    //  Demo correct password (change this later)
    const correctPassword = "12345";

    setTimeout(() => {
      setIsLoading(false);

      // Wrong password handling
      if (password !== correctPassword) {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (newAttempts >= 5) {
          setIsLocked(true);
          setLockTimer(30); // lock for 30 seconds
          setError(" Too many wrong attempts. Account locked for 30 seconds.");
          return;
        }

        setError(` Wrong password. Attempts left: ${5 - newAttempts}`);
        return;
      }
      

      //  Success
      setAttempts(0);
      setIsLoggedIn(true);
    }, 1200);
  };
  

  const handleLogout = () => {
    setIsLoggedIn(false);
    setStep(1);
    setPassword("");
    setKeepSignedIn(false);
    setError("");
    setShowPassword(false);
    setIsLoading(false);
    setCapsLockOn(false);

    setAttempts(0);
    setIsLocked(false);
    setLockTimer(0);
  };

  // Forgot Password Page
  if (showForgotPassword) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.logoRow}>
            <img
              src="/nokia-logo.png"
              alt="Nokia Logo"
              style={styles.nokiaLogo}
            />
           
          </div>

          <h2 style={styles.title}>Forgot password</h2>

          <p style={styles.helpText}>
            Enter your username and we’ll send reset instructions.
          </p>

          <input
            style={styles.input}
            type="text"
            placeholder="Username"
            value={forgotUsername}
            onChange={(e) => setForgotUsername(e.target.value)}
          />

          <div style={styles.buttonRow}>
            <button
              style={styles.btnSecondary}
              type="button"
              onClick={() => {
                setShowForgotPassword(false);
                setForgotUsername("");
                setError("");
              }}
            >
              Back
            </button>

            <button
              style={styles.btnPrimary}
              type="button"
              onClick={() => {
                if (!forgotUsername.trim()) {
                  setError("Please enter your username to reset password.");
                  return;
                }
                setError("");
                alert(`Reset link sent (Demo)\nUsername: ${forgotUsername}`);
              }}
            >
              Send
            </button>
          </div>

          {error && (
            <div style={{ ...styles.errorBox, marginTop: 14 }}>{error}</div>
          )}
        </div>

        <div style={styles.footer}>
          <span style={styles.footerText}>Terms of use</span>
          <span style={styles.footerDot}>•</span>
          <span style={styles.footerText}>Privacy & cookies</span>
        </div>
      </div>
    );
  }

  //  Success Page after login
  if (isLoggedIn) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.logoRow}>
            <img
              src="/nokia-logo.png"
              alt="Nokia Logo"
              style={styles.nokiaLogo}
            />
           
          </div>

          <h2 style={styles.title}> Login Successful</h2>

          <div style={styles.successBox}>
            <p style={styles.successText}>
              Welcome, <b>{username}</b> 🎉
            </p>
            <p style={styles.successSubText}>
              You are now signed in to Nokia SSO Demo.
            </p>
          </div>

          <button style={styles.btnPrimary} onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div style={styles.footer}>
          <span style={styles.footerText}>Terms of use</span>
          <span style={styles.footerDot}>•</span>
          <span style={styles.footerText}>Privacy & cookies</span>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Nokia Logo + Brand */}
        <div style={styles.logoRow}>
          <img
            src="/nokia-logo.png"
            alt="Nokia Logo"
            style={styles.nokiaLogo}
          />
         
        </div>

        <h2 style={styles.title}>{step === 1 ? "Sign in" : "Enter password"}</h2>

        {/* Username pill (Step 2) */}
        {step === 2 && (
          <div style={styles.userPill}>
            <button style={styles.backBtn} onClick={handleBack}>
              ←
            </button>
            <span style={styles.userEmail}>{username}</span>
          </div>
        )}

        {error && <div style={styles.errorBox}>{error}</div>}

        {/* Step 1 */}
        {step === 1 ? (
          <>
            <input
              style={styles.input}
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            {/*  Remember Username */}
            <label style={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={rememberUsername}
                onChange={(e) => handleRememberUsername(e.target.checked)}
                style={{ marginRight: 8 }}
              />
              <span style={styles.smallText}>Remember username</span>
            </label>

            <div style={styles.linkRow}>
              <span style={styles.smallText}>No account? </span>
              <a href="#create" style={styles.link}>
                Create one!
              </a>
            </div>

            <div style={styles.linkRow}>
              <a href="#signin-options" style={styles.link}>
                Sign-in options
              </a>
            </div>

            <div style={styles.buttonRow}>
              <button style={styles.btnSecondary} disabled>
                Back
              </button>
              <button style={styles.btnPrimary} onClick={handleNext}>
                Next
              </button>
            </div>
          </>
        ) : (
          /* Step 2 */
          <form onSubmit={handleSignIn}>
            {/* Password Input + Show/Hide */}
            <div style={styles.passwordWrap}>
              <input
                style={{ ...styles.input, marginBottom: 0 }}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyUp={(e) => {
                  const caps =
                    e.getModifierState && e.getModifierState("CapsLock");
                  setCapsLockOn(Boolean(caps));
                }}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>

            {/*  Caps Lock warning */}
            {capsLockOn && (
              <div style={styles.warningBox}> Caps Lock is ON</div>
            )}

            {/*  attempts info */}
            {attempts > 0 && !isLocked && (
              <div style={styles.attemptsText}>Attempts used: {attempts}/5</div>
            )}

            {/*  locked warning */}
            {isLocked && (
              <div style={styles.lockedBox}>
                 Account locked. Try again in {lockTimer}s.
              </div>
            )}

            <div style={{ height: 14 }} />

            <div style={styles.linkRow}>
              <button
                type="button"
                style={styles.linkBtn}
                onClick={() => {
                  setShowForgotPassword(true);
                  setForgotUsername(username);
                  setError("");
                }}
              >
                Forgot password?
              </button>
            </div>

            <label style={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={keepSignedIn}
                onChange={(e) => setKeepSignedIn(e.target.checked)}
                style={{ marginRight: 8 }}
              />
              <span style={styles.smallText}>Keep me signed in</span>
            </label>

            <div style={styles.buttonRow}>
              <button
                type="button"
                style={styles.btnSecondary}
                onClick={handleBack}
                disabled={isLoading}
              >
                Back
              </button>

              <button
                type="submit"
                style={{
                  ...styles.btnPrimary,
                  opacity: isLoading || isLocked ? 0.7 : 1,
                  cursor:
                    isLoading || isLocked ? "not-allowed" : "pointer",
                }}
                disabled={isLoading || isLocked}
              >
                {isLocked ? (
                  `Locked (${lockTimer}s)`
                ) : isLoading ? (
                  <span style={styles.loadingRow}>
                    <span style={styles.spinner}></span>
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      <div style={styles.footer}>
        <span style={styles.footerText}>Terms of use</span>
        <span style={styles.footerDot}>•</span>
        <span style={styles.footerText}>Privacy & cookies</span>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(120deg, #f2f8ff, #ffffff)",
    fontFamily: "Segoe UI, Arial, sans-serif",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    background: "#fff",
    borderRadius: 10,
    padding: "30px 28px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
    border: "1px solid #eaeaea",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
  },
  nokiaLogo: {
    width: 80,
    height: "auto",
    objectFit: "contain",
  },
  brand: {
    fontSize: 16,
    fontWeight: 800,
    color: "#0b5ed7",
    letterSpacing: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 600,
    margin: "6px 0 18px",
    color: "#222",
  },
  helpText: {
    fontSize: 13,
    color: "#444",
    marginTop: -6,
    marginBottom: 12,
    lineHeight: 1.4,
  },
  input: {
    width: "100%",
    padding: "12px 10px",
    borderRadius: 6,
    border: "1px solid #cfcfcf",
    outline: "none",
    fontSize: 14,
  },
  passwordWrap: {
    position: "relative",
    width: "100%",
  },
  eyeBtn: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    color: "#444",
    padding: 4,
  },
  warningBox: {
    marginTop: 10,
    background: "#fff4ce",
    border: "1px solid #ffda6a",
    padding: "8px 10px",
    borderRadius: 6,
    fontSize: 13,
    color: "#6b4e00",
  },
  attemptsText: {
    marginTop: 10,
    fontSize: 13,
    color: "#444",
  },
  lockedBox: {
    marginTop: 10,
    background: "#fde7e9",
    border: "1px solid #f3b6bd",
    padding: "8px 10px",
    borderRadius: 6,
    fontSize: 13,
    color: "#a80000",
  },
  linkRow: {
    marginBottom: 10,
    fontSize: 13,
  },
  smallText: {
    color: "#444",
  },
  link: {
    color: "#0b5ed7",
    textDecoration: "none",
    fontWeight: 500,
  },
  linkBtn: {
    color: "#0b5ed7",
    background: "transparent",
    border: "none",
    padding: 0,
    cursor: "pointer",
    fontWeight: 500,
    fontSize: 13,
  },
  buttonRow: {
    marginTop: 18,
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
  },
  btnPrimary: {
    background: "#0b5ed7",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: 6,
    fontWeight: 600,
  },
  btnSecondary: {
    background: "#f3f3f3",
    color: "#222",
    border: "1px solid #ddd",
    padding: "10px 18px",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: 600,
  },
  errorBox: {
    background: "#fde7e9",
    color: "#a80000",
    border: "1px solid #f3b6bd",
    padding: "10px 12px",
    borderRadius: 6,
    fontSize: 13,
    marginBottom: 12,
  },
  userPill: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "#f5f5f5",
    padding: "8px 10px",
    borderRadius: 8,
    marginBottom: 14,
  },
  backBtn: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: 16,
  },
  userEmail: {
    fontSize: 13,
    color: "#333",
    fontWeight: 600,
  },
  checkboxRow: {
    display: "flex",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 12,
  },
  footer: {
    marginTop: 20,
    display: "flex",
    gap: 10,
    fontSize: 12,
    color: "#666",
  },
  footerText: {
    cursor: "pointer",
  },
  footerDot: {
    opacity: 0.6,
  },

  // ✅ Loader
  loadingRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  spinner: {
    width: 14,
    height: 14,
    border: "2px solid rgba(255,255,255,0.5)",
    borderTop: "2px solid #fff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    display: "inline-block",
  },

  // ✅ Success screen
  successBox: {
    background: "#e8f3ff",
    border: "1px solid #b6dcff",
    padding: "14px 12px",
    borderRadius: 8,
    marginBottom: 18,
  },
  successText: {
    margin: 0,
    fontSize: 15,
    color: "#0b5ed7",
  },
  successSubText: {
    marginTop: 6,
    marginBottom: 0,
    fontSize: 13,
    color: "#333",
  },
};
