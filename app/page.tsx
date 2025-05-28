'use client';
import { useState, useRef, useEffect, ReactNode } from 'react';

// Types for menu options and banners
interface MenuOption {
  key: string;
  label: string;
}
const menuOptions: MenuOption[] = [
  { key: 'upgrade', label: 'Αναβάθμιση προγράμματος' },
  { key: 'tasks', label: 'Εργασίες' },
  { key: 'mygpt', label: 'Τα AinaGPT μου' },
  { key: 'customize', label: 'Προσαρμογή του AinaGPT' },
  { key: 'settings', label: 'Ρυθμίσεις' },
  { key: 'shortcuts', label: 'Συντομεύσεις πληκτρολογίου' },
  { key: 'report', label: 'Αναφορά παράνομου περιεχομένου' },
  { key: 'help', label: 'Βοήθεια και συχνές ερωτήσεις' },
  { key: 'notes', label: 'Σημειώσεις έκδοσης' },
  { key: 'terms', label: 'Όροι και πολιτικές' },
  { key: 'extension', label: 'Λάβε την επέκταση αναζήτησης με το AinaGPT' },
  { key: 'logout', label: 'Αποσύνδεση' }
];

const banners: { [key: string]: string } = {
  upgrade: 'Μπορείς να αναβαθμίσεις το πρόγραμμα σου για περισσότερες δυνατότητες!',
  tasks: 'Εδώ βλέπεις τις εκκρεμείς εργασίες σου.',
  mygpt: 'Οι AinaGPT σου για εύκολη πρόσβαση!',
  customize: 'Εξατομίκευσε το AinaGPT σου όπως θέλεις.',
  settings: 'Ρυθμίσεις λογαριασμού και εφαρμογής.',
  shortcuts: 'Όλες οι συντομεύσεις πληκτρολογίου εδώ.',
  report: 'Αναφορά περιεχομένου: Προσοχή στη σωστή χρήση.',
  help: 'Συχνές ερωτήσεις και υποστήριξη.',
  notes: 'Σημειώσεις έκδοσης της εφαρμογής.',
  terms: 'Δες όλους τους όρους και την πολιτική απορρήτου.',
  extension: 'Εγκατάστησε την επέκταση AinaGPT για αναζήτηση!',
  logout: 'Έγινε αποσύνδεση από το AinaGPT.',
};

// -------------- INTERFACES ΓΙΑ COMPONENTS --------------
interface DropDownMenuProps {
  email: string;
  onSelect: (key: string) => void;
}
function DropDownMenu({ email, onSelect }: DropDownMenuProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative flex items-center">
      <button
        className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-black text-xl font-bold shadow border border-gray-200 ml-3"
        onClick={() => setOpen(!open)}
        title="Μενού χρήστη"
        type="button"
      >
        D
      </button>
      {open && (
        <div className="absolute right-0 mt-2 top-10 w-64 bg-white rounded-xl shadow-lg border z-50 py-1 px-2">
          <div className="px-3 py-2 text-xs text-gray-600 font-medium border-b">{email}</div>
          <ul>
            {menuOptions.map(opt => (
              <li key={opt.key}>
                <button
                  className="w-full flex items-center text-left text-gray-800 hover:bg-gray-100 py-2 px-2 rounded-lg text-sm"
                  onClick={() => { onSelect(opt.key); setOpen(false); }}
                  type="button"
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

interface BannerProps {
  content?: string;
  onClose: () => void;
}
function Banner({ content, onClose }: BannerProps) {
  if (!content) return null;
  return (
    <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-40 max-w-lg w-full bg-white border rounded-2xl shadow-lg px-6 py-5 flex items-center justify-between">
      <span className="text-gray-800 text-sm">{content}</span>
      <button onClick={onClose} className="ml-4 text-lg text-gray-400 hover:text-black font-bold" type="button">×</button>
    </div>
  );
}

interface SidebarToggleProps {
  open: boolean;
  onToggle: () => void;
}
function SidebarToggle({ open, onToggle }: SidebarToggleProps) {
  return (
    <button
      className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 border border-gray-200 shadow ml-3"
      onClick={onToggle}
      title={open ? 'Κλείσιμο sidebar' : 'Άνοιγμα sidebar'}
      type="button"
    >
      <span className="text-lg">{open ? '←' : '☰'}</span>
    </button>
  );
}

interface ChatSidebarProps {
  open: boolean;
  sessions: {
    today: { id: string; title: string }[];
    yesterday: { id: string; title: string }[];
    week: { id: string; title: string }[];
  };
  activeSession: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onTab: (tab: string) => void;
  currentTab: string;
}
function ChatSidebar({ open, sessions, activeSession, onSelect, onNew, onTab, currentTab }: ChatSidebarProps) {
  if (!open) return null;
  return (
    <aside className="fixed left-0 top-0 h-full z-30 w-60 bg-white border-r shadow px-4 py-5 flex flex-col transition-all duration-200 font-sans">
      <div className="flex items-center mb-6">
        <span className="text-2xl font-black tracking-tight text-black select-none">AinaGPT</span>
      </div>
      <button
        className="mb-5 w-full bg-black text-white py-2 rounded-xl font-semibold"
        onClick={onNew}
        type="button"
      >+ Νέα συνομιλία</button>
      <div className="flex gap-2 mb-4 text-xs font-medium">
        {['Σήμερα', 'Χτες', '7 μέρες'].map(tab => (
          <button
            key={tab}
            onClick={() => onTab(tab)}
            className={`py-1 px-3 rounded-xl ${currentTab === tab ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}
            type="button"
          >
            {tab}
          </button>
        ))}
      </div>
      <ul className="flex-1 overflow-auto">
        {(sessions[currentTab === 'Σήμερα' ? 'today' : currentTab === 'Χτες' ? 'yesterday' : 'week'] || []).map(s => (
          <li key={s.id}>
            <button
              className={`w-full text-left py-2 px-2 rounded-lg truncate ${activeSession === s.id ? "bg-gray-200 font-bold" : ""} text-xs`}
              onClick={() => onSelect(s.id)}
              type="button"
            >{s.title}</button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function useTypewriter(text: string, enabled = true, speed = 18) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    if (!enabled) return setDisplayed(text);
    setDisplayed('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, enabled]);
  return displayed;
}

// Google sign in dummy
interface GoogleButtonProps {
  onClick: () => void;
}
function GoogleButton({ onClick }: GoogleButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 border border-gray-300 text-black bg-white py-2 rounded-full font-semibold text-lg shadow-sm hover:bg-gray-100 mb-2"
      style={{fontFamily: 'sans-serif'}}
      type="button"
    >
      <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="" className="w-5 h-5" />
      <span>Σύνδεση με Google</span>
    </button>
  );
}

interface WelcomeModalProps {
  onLogin: () => void;
  onSignup: () => void;
  onGoogle: () => void;
}
function WelcomeModal({ onLogin, onSignup, onGoogle }: WelcomeModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full flex flex-col items-center font-sans border">
        <h2 className="text-2xl font-bold mb-2">Καλώς επέστρεψες</h2>
        <p className="text-center mb-6 text-gray-700 text-base">
          Συνδέσου ή εγγράψου για να λαμβάνεις εξυπνότερες απαντήσεις, να αποστέλλεις αρχεία και εικόνες, και άλλα.
        </p>
        <GoogleButton onClick={onGoogle} />
        <button
          className="w-full mb-2 bg-black text-white py-2 rounded-full font-semibold text-lg border-2 border-black"
          style={{boxShadow: '0 2px 0 #000'}}
          onClick={onLogin}
          type="button"
        >
          Σύνδεση
        </button>
        <button
          className="w-full border-2 border-black text-black py-2 rounded-full font-semibold text-lg bg-white"
          style={{boxShadow: '0 1px 0 #000'}}
          onClick={onSignup}
          type="button"
        >
          Εγγραφή
        </button>
        <button className="mt-4 text-xs text-gray-500 underline" type="button">Διατήρηση αποσύνδεσης</button>
      </div>
    </div>
  );
}

interface EmailVerificationProps {
  email: string;
  onVerify: (code: string) => void;
}
function EmailVerification({ email, onVerify }: EmailVerificationProps) {
  const [code, setCode] = useState('');
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/10 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full flex flex-col items-center font-sans border">
        <h2 className="text-2xl font-bold mb-2">Έλεγξε τα εισερχόμενά σου</h2>
        <p className="text-center mb-6 text-gray-700">
          Πληκτρολόγησε τον κωδικό επαλήθευσης που μόλις αποστείλαμε στο <b>{email}</b>.
        </p>
        <input
          className="border border-green-400 rounded-lg px-4 py-2 mb-4 text-center outline-none w-full text-base"
          placeholder="Κωδικός"
          value={code}
          onChange={e => setCode(e.target.value)}
        />
        <button
          className="bg-green-600 text-white rounded-lg py-2 w-full mb-2 font-semibold text-lg"
          onClick={() => onVerify(code)}
          type="button"
        >
          Συνέχεια
        </button>
        <button className="text-xs text-gray-500 underline mb-2" type="button">Επανάληψη αποστολής email</button>
        <div className="flex mt-4 gap-6 text-xs text-green-700 font-medium w-full justify-center">
          <span>Όροι χρήσης</span>
          <span>Πολιτική απορρήτου</span>
        </div>
      </div>
    </div>
  );
}

interface PaymentBannerProps {
  onClose: () => void;
  onStripe: () => void;
}
function PaymentBanner({ onClose, onStripe }: PaymentBannerProps) {
  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full bg-white border rounded-2xl shadow-xl px-6 py-6 flex flex-col items-center">
      <span className="text-gray-800 text-base mb-3 font-semibold">Έφτασες το όριο δωρεάν μηνυμάτων! Για να συνεχίσεις, χρειάζεται να ενεργοποιήσεις συνδρομή.</span>
      <button
        onClick={onStripe}
        className="w-full bg-blue-600 text-white rounded-full py-2 px-6 font-semibold mb-3"
        type="button"
      >
        Πληρωμή με Stripe
      </button>
      <button className="text-xs text-gray-500 underline" onClick={onClose} type="button">
        Κλείσιμο
      </button>
    </div>
  );
}

// ------------ CHAT UI ------------
interface ChatUIProps {
  user: string;
}
interface Message {
  from: string;
  text: string;
}
function ChatUI({ user }: ChatUIProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sessions, setSessions] = useState<{
    today: { id: string; title: string }[];
    yesterday: { id: string; title: string }[];
    week: { id: string; title: string }[];
  }>({
    today: [{ id: '1', title: '...' }],
    yesterday: [],
    week: [],
  });
  const [currentTab, setCurrentTab] = useState('Σήμερα');
  const [activeSession, setActiveSession] = useState('1');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [answerCount, setAnswerCount] = useState(0);

  const lastMessage = messages.length ? messages[messages.length - 1] : null;
  const typingBot = lastMessage && lastMessage.from === 'bot';
  const typewriterText = useTypewriter(lastMessage?.text || '', typingBot);

  const [bannerKey, setBannerKey] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  // Για την αποθήκευση τίτλου με βάση την πρώτη λέξη
  useEffect(() => {
    if (messages.length === 1) {
      const firstWord = messages[0].text.split(' ')[0];
      setSessions(s => ({
        ...s,
        today: s.today.map(sess => sess.id === activeSession ? { ...sess, title: firstWord || 'Συνομιλία' } : sess),
      }));
    }
    if (answerCount >= 20) setShowPayment(true);
  }, [messages, answerCount, activeSession]);

  // Μικρόφωνο (demo)
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const handleMic = () => {
    if (typeof window === 'undefined' || !('webkitSpeechRecognition' in window)) {
      alert('Δεν υποστηρίζεται το μικρόφωνο σε αυτόν τον browser!');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'el-GR';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (e: any) => {
      if (e.results[0]) setInput(e.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
    setIsListening(true);
    recognitionRef.current = recognition;
  };

  const handleSend = () => {
    if (!input.trim() || showPayment) return;
    setMessages([...messages, { from: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(m => [...m, { from: 'bot', text: 'Bot απάντηση: ' + input }]);
      setAnswerCount(cnt => cnt + 1);
    }, 700);
  };

  const handleSelectSession = (id: string) => {
    setActiveSession(id);
    setMessages([]);
    setAnswerCount(0);
  };
  const handleNewSession = () => {
    const newId = String(Date.now());
    setSessions(s => ({
      ...s,
      today: [{ id: newId, title: '...' }, ...s.today],
    }));
    setActiveSession(newId);
    setMessages([]);
    setAnswerCount(0);
  };

  const handleUpload = () => {
    alert('Αρχείο ανέβηκε!');
  };

  // Stripe
  const handleStripe = () => {
    window.open('https://your-stripe-link.com', '_blank');
    setShowPayment(false);
    setAnswerCount(0);
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans flex">
      {/* Header με logo & DropDown */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-white border-b flex items-center justify-between px-4 z-50">
        <div className="flex items-center">
          <span className="font-black text-2xl text-black mr-4">AinaGPT</span>
          <SidebarToggle open={sidebarOpen} onToggle={() => setSidebarOpen(o => !o)} />
        </div>
        <div className="flex items-center">
          <DropDownMenu email={user} onSelect={key => setBannerKey(key)} />
        </div>
      </div>
      <ChatSidebar
        open={sidebarOpen}
        sessions={sessions}
        activeSession={activeSession}
        onSelect={handleSelectSession}
        onNew={handleNewSession}
        onTab={setCurrentTab}
        currentTab={currentTab}
      />
      {/* Main Chat με σταθερό input */}
      <main className={`flex-1 flex flex-col items-center justify-center transition-all duration-200 pt-16 ${sidebarOpen ? 'ml-60' : ''} relative`}>
        {/* Scrollable Messages */}
        <div className="w-full max-w-xl flex-1 flex flex-col justify-end items-center"
             style={{minHeight: '88vh', paddingBottom: '64px'}}>
          <div className="flex-1 w-full px-2 pt-4 pb-2 flex flex-col justify-end overflow-y-auto" style={{maxHeight: '75vh'}}>
            {messages.slice(0, -1).map((m, i) => (
              <div key={i} className={`mb-2 flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <span className={`px-3 py-2 rounded-2xl text-xs ${m.from === 'user' ? 'bg-blue-100' : 'bg-gray-200'} text-black`}>
                  {m.text}
                </span>
              </div>
            ))}
            {typingBot ? (
              <div className="mb-2 flex justify-start">
                <span className="px-3 py-2 rounded-2xl text-xs bg-gray-200 text-black font-mono" style={{ fontSize: 13 }}>{typewriterText}</span>
              </div>
            ) : lastMessage ? (
              <div className={`mb-2 flex ${lastMessage.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <span className={`px-3 py-2 rounded-2xl text-xs ${lastMessage.from === 'user' ? 'bg-blue-100' : 'bg-gray-200'} text-black`}>
                  {lastMessage.text}
                </span>
              </div>
            ) : null}
          </div>
        </div>
        {/* Σταθερό Chat Input */}
        <div className="fixed bottom-5 left-0 right-0 flex justify-center z-30">
          <div className="w-full max-w-xl flex items-center gap-2 px-2">
            <button
              onClick={handleMic}
              className={`rounded-full p-2 border ${isListening ? 'bg-green-200 border-green-400' : 'bg-white border-gray-300'} transition`}
              title={isListening ? "Σταμάτησε" : "Χρήση μικροφώνου"}
              type="button"
            >
              <svg width={18} height={18} fill="none" stroke="black" strokeWidth={1.5} viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="8" stroke="#333" strokeWidth="1.5" fill={isListening ? '#4ade80' : '#fff'} />
                <rect x="8" y="5" width="4" height="8" rx="2" fill="#333" />
                <rect x="7.25" y="13.5" width="5.5" height="1.5" rx="0.75" fill="#333" />
              </svg>
            </button>
            <label className="rounded-full p-2 border bg-white border-gray-300 hover:bg-gray-100 cursor-pointer" title="Ανέβασε αρχείο">
              <input type="file" className="hidden" onChange={handleUpload} />
              <span className="text-xl">+</span>
            </label>
            <input
              className="flex-1 border rounded-2xl px-3 py-2 outline-none text-xs"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Γράψε μήνυμα..."
              style={{ fontSize: 13 }}
              disabled={showPayment}
            />
            <button
              className="bg-black text-white px-4 py-2 rounded-2xl font-medium text-xs"
              onClick={handleSend}
              style={{ fontSize: 13 }}
              disabled={showPayment}
              type="button"
            >
              Αποστολή
            </button>
          </div>
        </div>
        {/* User info & extra κάτω αριστερά */}
        <div className="fixed left-4 bottom-3 text-xs text-gray-400 font-mono select-none flex flex-col gap-1">
          <span>{user}</span>
          <span>Πρόγραμμα: Free</span>
          <span>Έκδοση: v1.2.4</span>
        </div>
        {/* Payment */}
        {showPayment && <PaymentBanner onClose={() => setShowPayment(false)} onStripe={handleStripe} />}
        {/* Banner */}
        <Banner content={bannerKey ? banners[bannerKey] : undefined} onClose={() => setBannerKey(null)} />
      </main>
    </div>
  );
}

// === ROOT APP ===
export default function Home() {
  const [step, setStep] = useState<'welcome' | 'verify' | 'chat'>('welcome');
  const [email] = useState("closter.services@gmail.com");

  const handleGoogle = () => {
    setStep('verify');
    // Add here your real Google OAuth handler
  };
  const handleLogin = () => setStep('verify');
  const handleSignup = () => setStep('verify');
  const handleVerify = () => setStep('chat');

  return (
    <>
      {step === 'welcome' && (
        <WelcomeModal onLogin={handleLogin} onSignup={handleSignup} onGoogle={handleGoogle} />
      )}
      {step === 'verify' && (
        <EmailVerification email={email} onVerify={handleVerify} />
      )}
      {step === 'chat' && (
        <ChatUI user={email} />
      )}
    </>
  );
}
