import { useState, useEffect } from 'react';
import Loading from './popup/Loading';
import LoginForm from './popup/LoginForm'; 
import Dashboard from './popup/Dashboard'; // Importujemy nowy komponent
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [view, setView] = useState<'login' | 'dashboard'>('login');
  // Przeniesiony stan języka, aby był dostępny globalnie
  const [lang, setLang] = useState<'pl' | 'en'>('pl');

  const triggerDemo = () => {
    setIsLoading(true); 
    setTimeout(() => {
      setView('dashboard'); 
      setIsLoading(false);  
    }, 2000);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="app-container">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="fade-in">
          {view === 'login' ? (
            /* Przekazujemy stan języka do LoginForm */
            <LoginForm 
              onDemoStart={triggerDemo} 
              lang={lang} 
              setLang={setLang} 
            /> 
          ) : (
            /* Wyświetlamy Dashboard zamiast placeholderu */
            <Dashboard 
              lang={lang} 
              setLang={setLang} 
              onBack={() => setView('login')} 
            />
          )}
        </div>
      )}
    </div>
  );
}

export default App;