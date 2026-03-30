import React, { useState } from 'react';
import './LoginForm.css';

// --- SŁOWNIK TŁUMACZEŃ ---
const translations = {
  pl: {
    welcome: "Witaj ponownie",
    subHeader: "Zaloguj się, aby śledzić oferty pracy",
    email: "E-mail",
    password: "Hasło",
    remember: "Zapamiętaj mnie",
    login: "Zaloguj się",
    or: "lub kontynuuj z",
    forgot: "Zapomniałeś hasła?",
    noAccount: "Nie masz konta?",
    signup: "Zarejestruj się",
    slogan: "Twoja kariera pod kontrolą.",
    registerTitle: "Stwórz konto",
    registerSub: "Dołącz do JobTracker i zacznij śledzić oferty",
    fullName: "Imię i Nazwisko",
    confirmPass: "Powtórz hasło",
    requiredError: "To pole jest wymagane",
    trustTitle: "Dlaczego warto nam zaufać?",
    trust1: "Bezpieczeństwo danych: Twoje dane są szyfrowane i chronione.",
    trust2: "Automatyzacja: Śledzimy najnowsze oferty pracy 24/7.",
    trust3: "Darmowy dostęp: Podstawowe funkcje zawsze pozostaną free.",
    extTitle: "Zainstaluj naszą wtyczkę",
    extSub: "Automatycznie zapisuj oferty jednym kliknięciem.",
    extBtn: "Dodaj do Chrome",
    forgotTitle: "Odzyskaj hasło",
    forgotSub: "Wprowadź swój e-mail, aby otrzymać instrukcje resetowania hasła",
    sendInstructions: "Wyślij instrukcje",
    backToLogin: "Wróć do logowania",
    demoTitle: "Sprawdź Dashboard", // Nowy klucz
    demoSub: "Zobacz wersję demo panelu zarządzania.", // Nowy klucz
    demoBtn: "Uruchom Demo",
    loggingOut: "Wylogowywanie...",
    powerSlogan: "Śledź wszystkie aplikacje z LinkedIn, Pracuj.pl i innych portali w jednym miejscu – bez ręcznego wpisywania."
  },
  en: {
    welcome: "Welcome back",
    subHeader: "Log in to track job offers",
    email: "E-mail",
    password: "Password",
    remember: "Remember me",
    login: "Log in",
    or: "or continue with",
    forgot: "Forgot password?",
    noAccount: "Don't have an account?",
    signup: "Sign up",
    slogan: "Your career under control.",
    registerTitle: "Create Account",
    registerSub: "Join JobTracker and start tracking offers",
    fullName: "Full Name",
    confirmPass: "Confirm Password",
    requiredError: "This field is required",
    trustTitle: "Why trust us?",
    trust1: "Data security: Your data is encrypted and protected.",
    trust2: "Automation: We track the latest job offers 24/7.",
    trust3: "Free access: Basic features will always remain free.",
    extTitle: "Install our extension",
    extSub: "Automatically save offers with one click.",
    extBtn: "Add to Chrome",
    forgotTitle: "Reset Password",
    forgotSub: "Enter your email and we'll send you reset instructions.",
    sendInstructions: "Send Instructions",
    backToLogin: "Back to login",
    demoTitle: "Check Dashboard", // Nowy klucz
    demoSub: "See the demo version of the management panel.", // Nowy klucz
    demoBtn: "Run Demo",
    loggingOut: "Logging out...",
    powerSlogan: "Track all applications from LinkedIn, Glassdoor, and other portals in one place – no manual entry required."
  }
};

// Zaktualizowane typowanie propsów - dodano obsługę języka z zewnątrz
interface LoginFormProps {
  onDemoStart: () => void;
  lang: 'pl' | 'en';
  setLang: (l: 'pl' | 'en') => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onDemoStart, lang, setLang }) => {
  // --- STAN APLIKACJI (Lokalny) ---
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  
  const t = translations[lang];

  // Obsługa Demo
  const handleDemoClick = () => {
    setIsDemoLoading(true);
    onDemoStart();
  };

  // --- FUNKCJE WALIDACJI ---
  const handleInvalid = (e: React.FormEvent<HTMLInputElement>) => {
    (e.target as HTMLInputElement).setCustomValidity(t.requiredError);
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    (e.target as HTMLInputElement).setCustomValidity("");
  };

  const googleIcon = (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );

  return (
    <div className="login-container">
      
      {/* GŁÓWNA TREŚĆ STRONY */}
      <div className={`main-content ${isRegisterOpen || isForgotOpen ? 'blur-active' : ''}`}>
        
        {/* Przełącznik języków */}
        <div className="lang-switcher">
          <button 
            type="button"
            className={`lang-btn ${lang === 'pl' ? 'active' : ''}`} 
            onClick={() => setLang('pl')}
          >
            <svg width="28" height="20" viewBox="0 0 16 10">
              <rect width="16" height="10" fill="#fff"/>
              <rect width="16" height="5" y="5" fill="#dc143c"/>
            </svg>
            <span>PL</span>
          </button>

          <button 
            type="button"
            className={`lang-btn ${lang === 'en' ? 'active' : ''}`} 
            onClick={() => setLang('en')}
          >
            <svg width="28" height="20" viewBox="0 0 60 30">
              <clipPath id="s"><rect width="60" height="30"/></clipPath>
              <g clipPath="url(#s)">
                <path d="M0,0H60V30H0Z" fill="#012169"/>
                <path d="M0,0L60,30M60,0L0,30" stroke="#fff" strokeWidth="6"/>
                <path d="M0,0L60,30M60,0L0,30" stroke="#C8102E" strokeWidth="4"/>
                <path d="M30,0V30M0,15H60" stroke="#fff" strokeWidth="10"/>
                <path d="M30,0V30M0,15H60" stroke="#C8102E" strokeWidth="6"/>
              </g>
            </svg>
            <span>EN</span>
          </button>
        </div>

        {/* Sekcja Brandingowa (Lewa strona) */}
        <div className="brand-section">
          <h1 className="brand-logo">JobTracker<span>.</span></h1>
          <p className="brand-slogan">{t.slogan}</p>

          {/* NOWY KONTENER: Grupuje kafelki poziomo */}
          <div className="tiles-row">
            
            {/* Kafelek 1: Wtyczka */}
            <div className="extension-tile">
              <div className="extension-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.29 7 12 12 20.71 7" />
                  <line x1="12" y1="22" x2="12" y2="12" />
                </svg>
              </div>
              <div className="extension-text">
                <h4>{t.extTitle}</h4>
                <p>{t.extSub}</p>
              </div>
              <button className="install-btn">{t.extBtn}</button>
            </div>

          {/* Kafelek 2: Dashboard / Demo */}
          <div className="extension-tile">
            <div className="extension-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
            </div>
            <div className="extension-text">
              {/* Wykorzystujemy nowe klucze tłumaczeń */}
              <h4>{t.demoTitle}</h4>
              <p>{t.demoSub}</p>
            </div>
            <button className="install-btn" onClick={handleDemoClick} disabled={isDemoLoading}>
              {isDemoLoading ? (
                <span className="dot-loader">
                  <span>.</span><span>.</span><span>.</span>
                </span>
              ) : t.demoBtn}
            </button>
          </div>
          </div> {/* Koniec tiles-row */}
          
        <div className="power-slogan-container fade-in">
            <p className="power-slogan-text">
              {t.powerSlogan}
            </p>
        </div>
        </div> {/* Koniec brand-section */}


        {/* Formularz Logowania (Prawa strona) */}
        <form className="login-form" onSubmit={(e) => e.preventDefault()}>
          <h2>{t.welcome}</h2>
          <p className="sub-header">{t.subHeader}</p>
          
          <div className="input-group">
            <input type="email" placeholder={t.email} required onInvalid={handleInvalid} onInput={handleInput} />
          </div>
          
          <div className="input-group">
            <input type="password" placeholder={t.password} required onInvalid={handleInvalid} onInput={handleInput} />
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" className="custom-checkbox" /> 
              <span>{t.remember}</span>
            </label>
          </div>
          
          <button type="submit" className="login-btn">{t.login}</button>

          <div className="separator"><span>{t.or}</span></div>

          <button type="button" className="google-btn">
            {googleIcon} Google
          </button>
          
          <div className="form-footer">
            <a href="#" className="forgot-pass" onClick={(e) => {
              e.preventDefault();
              setIsForgotOpen(true);
            }}>{t.forgot}</a>

            <div className="signup-text">
              {t.noAccount} 
              <button type="button" className="signup-link-btn" onClick={() => setIsRegisterOpen(true)}>
                {t.signup}
              </button>
            </div>
          </div>
        </form>

        <footer className="author-footer">
          <p> Dominik Skutecki &reg; 2026</p>
        </footer>
      </div>

      {/* MODAL REJESTRACJI (Dwie kolumny) */}
      {isRegisterOpen && (
        <div className="modal-overlay" onClick={() => setIsRegisterOpen(false)}>
          <div className="register-modal wide" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setIsRegisterOpen(false)}>&times;</button>
            <div className="modal-column info-side">
                <h3>{t.trustTitle}</h3>
                <ul className="trust-list">
                    <li><span>✦</span> {t.trust1}</li>
                    <li><span>✦</span> {t.trust2}</li>
                    <li><span>✦</span> {t.trust3}</li>
                </ul>
            </div>
            <div className="modal-column form-side">
                <h2>{t.registerTitle}</h2>
                <p className="modal-sub">{t.registerSub}</p>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="input-group">
                        <input type="text" placeholder={t.fullName} required onInvalid={handleInvalid} onInput={handleInput} />
                    </div>
                    <div className="input-group">
                        <input type="email" placeholder={t.email} required onInvalid={handleInvalid} onInput={handleInput} />
                    </div>
                    <div className="input-group">
                        <input type="password" placeholder={t.password} required onInvalid={handleInvalid} onInput={handleInput} />
                    </div>
                    <div className="input-group">
                        <input type="password" placeholder={t.confirmPass} required onInvalid={handleInvalid} onInput={handleInput} />
                    </div>
                    <button type="submit" className="login-btn">{t.signup}</button>
                </form>
                <div className="separator"><span>{t.or}</span></div>
                <button type="button" className="google-btn">{googleIcon} Google</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ODZYSKIWANIA HASŁA */}
      {isForgotOpen && (
        <div className="modal-overlay" onClick={() => setIsForgotOpen(false)}>
          <div className="register-modal forgot-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setIsForgotOpen(false)}>&times;</button>
            <div className="modal-form-section" style={{ padding: '45px', textAlign: 'center' }}>
              <h2 className="gradient-text" style={{ 
                 background: 'linear-gradient(to right, #fff, var(--primary-cyan))',
                 WebkitBackgroundClip: 'text',
                 WebkitTextFillColor: 'transparent'
              }}>{t.forgotTitle}</h2>
              <p className="modal-sub">{t.forgotSub}</p>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="input-group">
                  <input type="email" placeholder={t.email} required onInvalid={handleInvalid} onInput={handleInput} />
                </div>
                <button type="submit" className="login-btn">{t.sendInstructions}</button>
              </form>
              <button className="signup-link-btn" style={{ marginTop: '20px' }} onClick={() => setIsForgotOpen(false)}>
                {t.backToLogin}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;