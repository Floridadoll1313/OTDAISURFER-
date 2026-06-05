import React, { useState, useEffect } from 'react';
import { 
  googleSignIn, 
  getAccessToken, 
  logout, 
  initAuth,
  db,
  handleFirestoreError,
  OperationType
} from '../lib/firebase';
import { User } from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot,
  query,
  updateDoc,
  where,
  orderBy
} from 'firebase/firestore';
import { 
  Mail, 
  Calendar, 
  CheckSquare, 
  Notebook, 
  FileSpreadsheet, 
  LogOut, 
  LogIn, 
  Check, 
  Plus, 
  Trash2, 
  Send,
  Loader2,
  Lock,
  ExternalLink,
  RefreshCw,
  Eye,
  AlertTriangle,
  Clock
} from 'lucide-react';

interface KeepNote {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: any;
}

export default function GoogleWorkspaceControl() {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'gmail' | 'calendar' | 'tasks' | 'keep' | 'forms'>('gmail');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Tab specific states
  const [loadingData, setLoadingData] = useState(false);

  // Gmail Data & Actions
  const [emails, setEmails] = useState<any[]>([]);
  const [newEmail, setNewEmail] = useState({ to: '', subject: '', body: '' });
  const [sendingEmail, setSendingEmail] = useState(false);

  // Calendar Data & Actions
  const [events, setEvents] = useState<any[]>([]);
  const [newEvent, setNewEvent] = useState({ summary: '', description: '', start: '', end: '' });
  const [schedulingEvent, setSchedulingEvent] = useState(false);

  // Tasks Data & Actions
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskNotes, setNewTaskNotes] = useState('');
  const [newTaskDue, setNewTaskDue] = useState('');
  const [addingTask, setAddingTask] = useState(false);

  // Keep Notes (Firestore-backed)
  const [notes, setNotes] = useState<KeepNote[]>([]);
  const [newNote, setNewNote] = useState({ title: '', content: '', color: '#1e1b4b' });

  // Forms Data
  const [formIdInput, setFormIdInput] = useState('');
  const [fetchedForm, setFetchedForm] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Load and subscribe to Auth states
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setAccessToken(token);
        setAuthLoading(false);
      },
      () => {
        setUser(null);
        setAccessToken(null);
        setAuthLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Sync data whenever user & token is loaded
  useEffect(() => {
    if (user && accessToken) {
      fetchTabSpecificData();
    } else {
      setEmails([]);
      setEvents([]);
      setTasks([]);
    }
  }, [user, accessToken, activeTab]);

  // Firestore-backed Google Keep Sync
  useEffect(() => {
    if (!user) {
      setNotes([]);
      return;
    }
    const notesRef = collection(db, 'notes');
    const q = query(
      notesRef, 
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: KeepNote[] = [];
      snapshot.forEach(docSnap => {
        const d = docSnap.data();
        fetched.push({
          id: docSnap.id,
          title: d.title || '',
          content: d.content || '',
          color: d.color || '#1e1b4b',
          createdAt: d.createdAt
        });
      });
      setNotes(fetched);
    }, (error) => {
      console.error("Firestore Notes subscription error:", error);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSignIn = async () => {
    try {
      setAuthLoading(true);
      setErrorMessage(null);
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setAccessToken(res.accessToken);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error executing Google authentication popup.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (window.confirm("Are you sure you want to sign out? This will clear in-memory tokens.")) {
      await logout();
      setUser(null);
      setAccessToken(null);
    }
  };

  const fetchTabSpecificData = async () => {
    if (!accessToken) return;
    setLoadingData(true);
    setErrorMessage(null);
    try {
      if (activeTab === 'gmail') {
        await fetchGmail();
      } else if (activeTab === 'calendar') {
        await fetchCalendar();
      } else if (activeTab === 'tasks') {
        await fetchTasks();
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`Failed to fetch live API data. Token may be expired. Try re-signing in.`);
    } finally {
      setLoadingData(false);
    }
  };

  // Google Calendar API integration
  const fetchCalendar = async () => {
    const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?orderBy=startTime&singleEvents=true&maxResults=8', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!res.ok) throw new Error('Failed to retrieve Google Calendar events');
    const data = await res.json();
    setEvents(data.items || []);
  };

  const handleAddCalendarEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.summary || !newEvent.start || !newEvent.end) {
      alert("Please provide brief summary, start time, and end time.");
      return;
    }

    if (!window.confirm(`Create Google Calendar Event: "${newEvent.summary}"?`)) {
      return;
    }

    setSchedulingEvent(true);
    try {
      const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          summary: newEvent.summary,
          description: newEvent.description,
          start: { dateTime: new Date(newEvent.start).toISOString() },
          end: { dateTime: new Date(newEvent.end).toISOString() }
        })
      });

      if (!res.ok) throw new Error("Could not schedule Calendar event");
      setNewEvent({ summary: '', description: '', start: '', end: '' });
      await fetchCalendar();
      alert("Calendar event scheduled successfully!");
    } catch (err: any) {
      alert("API Error: " + err.message);
    } finally {
      setSchedulingEvent(false);
    }
  };

  const handleDeleteCalendarEvent = async (eventId: string) => {
    if (!window.confirm("Are you sure you want to delete this Google Calendar meeting?")) {
      return;
    }
    try {
      const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!res.ok) throw new Error("Could not delete Calendar event");
      await fetchCalendar();
      alert("Event removed.");
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Gmail API integration
  const fetchGmail = async () => {
    const listRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=8', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!listRes.ok) throw new Error('Failed to list Gmail messages');
    const listData = await listRes.json();
    
    if (listData.messages && listData.messages.length > 0) {
      const fetchedMsgs = [];
      for (const msg of listData.messages) {
        try {
          const detailRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          const detail = await detailRes.json();
          fetchedMsgs.push(detail);
        } catch (err) {
          console.error("Error fetching individual message detail:", err);
        }
      }
      setEmails(fetchedMsgs);
    } else {
      setEmails([]);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.to || !newEmail.subject || !newEmail.body) {
      alert("Please fill in recipient, subject, and email body contents.");
      return;
    }

    if (!window.confirm(`Send email to ${newEmail.to} with subject "${newEmail.subject}" on your behalf?`)) {
      return;
    }

    setSendingEmail(true);
    try {
      const emailContent = [
        `To: ${newEmail.to}`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        `Subject: ${newEmail.subject}`,
        '',
        `<div style="font-family: sans-serif; padding: 15px; border-left: 4px solid #06b6d4; background-color: #f8fafc;">
          ${newEmail.body.replace(/\ng/, '<br/>')}
          <hr style="margin-top: 20px; border:0; border-top: 1px solid #e2e8f0;"/>
          <p style="font-size: 11px; color:#64748b;">Dispatched securely via <b>Ocean Tide Drop AI Surfer Hub</b> Workspace nodes.</p>
         </div>`
      ].join('\r\n');

      const encodedEmail = btoa(unescape(encodeURIComponent(emailContent)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const sendRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ raw: encodedEmail })
      });

      if (!sendRes.ok) throw new Error("Could not send email payload");
      setNewEmail({ to: '', subject: '', body: '' });
      await fetchGmail();
      alert("Gmail message dispatched safely!");
    } catch (err: any) {
      alert("Error sending email: " + err.message);
    } finally {
      setSendingEmail(false);
    }
  };

  // Google Tasks API integration
  const fetchTasks = async () => {
    const res = await fetch('https://tasks.googleapis.com/tasks/v1/lists/@default/tasks?maxResults=10', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!res.ok) throw new Error('Failed to retrieve Tasks list');
    const data = await res.json();
    setTasks(data.tasks || []);
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;

    setAddingTask(true);
    try {
      const body: any = {
        title: newTaskTitle,
        notes: newTaskNotes
      };
      if (newTaskDue) {
        body.due = new Date(newTaskDue).toISOString();
      }

      const res = await fetch('https://tasks.googleapis.com/tasks/v1/lists/@default/tasks', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) throw new Error('Could not add Google Task item');
      setNewTaskTitle('');
      setNewTaskNotes('');
      setNewTaskDue('');
      await fetchTasks();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setAddingTask(false);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      const res = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/@default/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'completed' })
      });
      if (!res.ok) throw new Error('Could not complete task');
      await fetchTasks();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm("Delete this Google Task checklist item?")) return;
    try {
      const res = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/@default/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!res.ok) throw new Error('Could not delete Task');
      await fetchTasks();
      alert("Task deleted.");
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Google Keep Note Sync (backed by rules-hardened Firestore collection)
  const handleAddKeepNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.title || !newNote.content) return;
    if (!user) return;

    try {
      const payload = {
        userId: user.uid,
        title: newNote.title,
        content: newNote.content,
        color: newNote.color,
        createdAt: new Date().toISOString()
      };
      await addDoc(collection(db, 'notes'), payload);
      setNewNote({ title: '', content: '', color: '#1e1b4b' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'notes');
    }
  };

  const handleDeleteKeepNote = async (noteId: string) => {
    if (!window.confirm("Delete this strategic Keep note?")) return;
    try {
      await deleteDoc(doc(db, 'notes', noteId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `notes/${noteId}`);
    }
  };

  // Google Forms API integration
  const fetchGoogleForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formIdInput) return;

    setFormLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch(`https://forms.googleapis.com/v1/forms/${formIdInput}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!res.ok) throw new Error("Could not find or fetch the specified Form ID. Ensure API scopes are met.");
      const data = await res.json();
      setFetchedForm(data);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const loadPredefinedFormTemplate = (type: 'consultation' | 'feedback') => {
    if (type === 'consultation') {
      setFetchedForm({
        formId: "mock-otd-consultation-form",
        info: {
          title: "OTD Enterprise AI Strategy Consulting Form",
          description: "Qualification questionnaire for Ocean Tide Drop consulting lead generation campaigns."
        },
        items: [
          { title: "Contact Name", questionItem: { question: { required: true } } },
          { title: "Company domain & assets", questionItem: { question: { required: true } } },
          { title: "What is your main AI automation bottleneck?", questionItem: { question: { required: false } } },
          { title: "Select target Cloud database infrastructure support preferred", questionItem: { question: { required: true } } }
        ]
      });
    } else {
      setFetchedForm({
        formId: "mock-feedback-form",
        info: {
          title: "OTD AI Surfer Applet Feedback",
          description: "Evaluate user-satisfaction metrics for dual-site blueprint deployments."
        },
        items: [
          { title: "User Satisfaction Score (1-10)", questionItem: { question: { required: true } } },
          { title: "What custom features should be added next?", questionItem: { question: { required: false } } }
        ]
      });
    }
  };

  // Extract Email Headers nicely
  const getHeader = (headers: any[], name: string) => {
    return headers?.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || 'N/A';
  };

  // If loading general auth state
  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 border border-white/10 bg-editorial-dark font-mono text-xs text-editorial-accent">
        <Loader2 className="w-6 h-6 animate-spin mb-2" />
        ESTABLISHING COORD INTEL GATEWAY...
      </div>
    );
  }

  // Not Authenticated screen
  if (!user || !accessToken) {
    return (
      <div className="bg-editorial-dark border border-white/15 p-8 text-center space-y-6 max-w-2xl mx-auto rounded-none">
        <div className="flex justify-center">
          <div className="p-4 bg-white/5 border border-white/10 rounded-full text-editorial-accent relative">
            <Lock className="w-8 h-8 font-thin" />
            <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-editorial-dark animate-pulse"></div>
          </div>
        </div>
        <div className="space-y-2">
          <span className="text-[10px] font-mono tracking-widest text-[#cbd5e1] font-bold uppercase py-1 px-3 bg-red-950/40 border border-red-900/40 inline-block">
            SECURITY KEY REQUIRED
          </span>
          <h2 className="font-display font-black text-xl tracking-wider text-white uppercase">Google Workspace Link Node</h2>
          <p className="text-zinc-400 text-xs font-sans max-w-md mx-auto">
            Authorize Google Calendar, Gmail, Keep, Forms, and Tasks to load real business intelligence metrics and configure active strategic pipelines.
          </p>
        </div>

        <div className="pt-2 flex flex-col items-center justify-center">
          <button
            type="button"
            onClick={handleSignIn}
            className="gsi-material-button cursor-pointer relative hover:opacity-90 active:scale-95 transition-all outline-none"
          >
            <div className="gsi-material-button-state"></div>
            <div className="gsi-material-button-content-wrapper font-mono tracking-wider font-bold">
              <div className="gsi-material-button-icon">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: "block" }}>
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
              </div>
              <span className="gsi-material-button-contents pr-2">Link Google Account</span>
            </div>
          </button>
          
          <span className="text-[10.5px] text-editorial-muted font-mono mt-4 block">
            Safe OAuth sandbox authorized under <span className="text-zinc-300 font-bold">@gmail.com</span> limits.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-editorial-dark border border-white/10 rounded-none w-full flex flex-col lg:flex-row min-h-[600px]" id="workspace-control-hub">
      
      {/* Sidebar for Quick Auth info and tab switching */}
      <div className="w-full lg:w-72 border-r border-white/10 p-5 flex flex-col justify-between bg-black/20 gap-6">
        <div className="space-y-6">
          
          {/* Linked Google User summary */}
          <div className="bg-white/5 border border-white/10 p-4 relative overflow-hidden">
            <span className="text-[8px] font-mono text-cyan-400 font-bold tracking-widest uppercase block mb-1">LIVE SECURE TOKEN GALAXY</span>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-700/60 border border-cyan-400/50 flex items-center justify-center font-bold text-white text-xs shrink-0">
                {user.displayName ? user.displayName.split(' ').map(n=>n[0]).join('') : user.email?.[0].toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-mono font-bold text-slate-100 truncate">{user.displayName || 'Enterprise Lead'}</p>
                <p className="text-[10px] font-mono text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
            
            <div className="mt-3 flex items-center gap-2 text-[9px] font-mono bg-black/40 px-2 py-1 border border-white/5 text-[#d1d5db]">
              <Clock className="w-3 h-3 text-cyan-400 shrink-0" />
              <span>Token Active</span>
            </div>
          </div>

          {/* Quick tab controllers */}
          <div className="space-y-1">
            <span className="text-[9px] font-mono text-slate-500 font-black tracking-widest uppercase block px-2 mb-2">Workspace Modules</span>
            
            <button
              type="button"
              onClick={() => setActiveTab('gmail')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-mono uppercase tracking-wider transition-all rounded-none ${activeTab === 'gmail' ? 'bg-cyan-500/15 border-l-2 border-cyan-400 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" />
                Gmail Inbox
              </span>
              <span className="text-[9px] bg-white/5 border border-white/10 text-slate-400 px-1 py-0.5 rounded">REST</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('calendar')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-mono uppercase tracking-wider transition-all rounded-none ${activeTab === 'calendar' ? 'bg-cyan-500/15 border-l-2 border-cyan-400 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 shrink-0" />
                Google Calendar
              </span>
              <span className="text-[9px] bg-white/5 border border-white/10 text-slate-400 px-1 py-0.5 rounded">API</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('tasks')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-mono uppercase tracking-wider transition-all rounded-none ${activeTab === 'tasks' ? 'bg-cyan-500/15 border-l-2 border-cyan-400 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <span className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 shrink-0" />
                Google Tasks
              </span>
              <span className="text-[9px] bg-white/5 border border-white/10 text-slate-400 px-1 py-0.5 rounded">SDK</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('keep')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-mono uppercase tracking-wider transition-all rounded-none ${activeTab === 'keep' ? 'bg-cyan-500/15 border-l-2 border-cyan-400 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <span className="flex items-center gap-2">
                <Notebook className="w-4 h-4 shrink-0" />
                Keep Notes
              </span>
              <span className="text-[9px] bg-cyan-950/40 border border-cyan-800/40 text-cyan-300 px-1 py-0.5 rounded">Firestore</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('forms')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-mono uppercase tracking-wider transition-all rounded-none ${activeTab === 'forms' ? 'bg-cyan-500/15 border-l-2 border-cyan-400 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <span className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 shrink-0" />
                Google Forms
              </span>
              <span className="text-[9px] bg-white/5 border border-white/10 text-slate-400 px-1 py-0.5 rounded">Live</span>
            </button>

          </div>

        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 bg-red-950/20 hover:bg-red-950/50 text-red-400 border border-red-900/45 py-2 px-4 font-mono text-xs uppercase tracking-widest cursor-pointer transition-all"
        >
          <LogOut className="w-3.5 h-3.5 shrink-0" />
          Disconnect Sync
        </button>

      </div>

      {/* Main interactive Tab Content Area */}
      <div className="flex-1 p-6 flex flex-col justify-between" id="active-space-panel">
        <div>
          {/* Header row for the main active tab */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div className="space-y-1">
              <span className="text-[9px] bg-cyan-950/30 text-cyan-400 border border-cyan-900/30 px-2 py-0.5 font-mono uppercase font-black tracking-widest">
                {activeTab === 'keep' ? 'Secured via Firestore' : 'Live Google Integration Node'}
              </span>
              <h3 className="font-display font-black tracking-wider uppercase text-lg text-white flex items-center gap-2">
                {activeTab === 'gmail' && 'Gmail Interaction Room'}
                {activeTab === 'calendar' && 'Operational Google Calendar'}
                {activeTab === 'tasks' && 'Strategic Tasks Ledger'}
                {activeTab === 'keep' && 'Keep Strategy Notes'}
                {activeTab === 'forms' && 'Google Forms Blueprint Analyzer'}
              </h3>
            </div>
            
            {activeTab !== 'keep' && (
              <button
                type="button"
                onClick={fetchTabSpecificData}
                disabled={loadingData}
                className="flex items-center gap-1.5 border border-white/10 hover:bg-white/5 px-2.5 py-1.5 text-[10px] font-mono tracking-widest uppercase text-slate-400 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${loadingData ? 'animate-spin' : ''}`} />
                Reload
              </button>
            )}
          </div>

          {/* Any global state messages */}
          {errorMessage && (
            <div className="bg-red-950/40 border border-red-900/50 p-4 font-mono text-[11px] text-red-200 mb-6 flex items-start gap-2 rounded-none">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold uppercase tracking-wider">Communication Fault</p>
                <p className="mt-0.5 text-zinc-300 font-sans">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Render Active Tab */}
          {loadingData ? (
            <div className="flex flex-col items-center justify-center py-20 font-mono text-xs text-slate-400 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
              SYNCHRONIZING SECURE REMOTE PAYLOADS...
            </div>
          ) : (
            <div className="space-y-6">

              {/* T1: GMAIL */}
              {activeTab === 'gmail' && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                  
                  {/* Composing Emails */}
                  <div className="bg-white/5 border border-white/10 p-5 space-y-4">
                    <span className="text-[9px] font-mono text-cyan-400 font-bold tracking-widest uppercase block">&bull; DISPATCH GMAIL PAYLOAD</span>
                    <h4 className="font-mono text-xs text-white uppercase tracking-wider">Compose Strategic Mail</h4>
                    
                    <form onSubmit={handleSendEmail} className="space-y-3 font-mono text-xs">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">RECIPIENT EMAIL</label>
                        <input
                          type="email"
                          required
                          placeholder="client@enterprise.com"
                          value={newEmail.to}
                          onChange={(e)=>setNewEmail({...newEmail, to: e.target.value})}
                          className="w-full bg-editorial-dark border border-white/10 focus:border-cyan-400 p-2.5 outline-none font-mono text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">SUBJECT MATTER</label>
                        <input
                          type="text"
                          required
                          placeholder="Ocean Tide Drop Automation Strategy Alignment"
                          value={newEmail.subject}
                          onChange={(e)=>setNewEmail({...newEmail, subject: e.target.value})}
                          className="w-full bg-editorial-dark border border-white/10 focus:border-cyan-400 p-2.5 outline-none font-mono text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">EMAIL BODY (SUPPORT HTML)</label>
                        <textarea
                          required
                          rows={5}
                          placeholder="Write your corporate advisory blueprint here..."
                          value={newEmail.body}
                          onChange={(e)=>setNewEmail({...newEmail, body: e.target.value})}
                          className="w-full bg-editorial-dark border border-white/10 focus:border-cyan-400 p-2.5 outline-none font-sans text-xs text-white"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        disabled={sendingEmail}
                        className="w-full bg-cyan-500 hover:bg-cyan-600 text-black py-2.5 text-xs font-mono font-black tracking-widest uppercase cursor-pointer flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                      >
                        {sendingEmail ? (
                          <Loader2 className="w-4 h-4 animate-spin text-black" />
                        ) : (
                          <Send className="w-3.5 h-3.5 text-black" />
                        )}
                        SEND CORPORATE GMAIL
                      </button>
                    </form>
                  </div>

                  {/* Gmail Inbox view */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-mono text-xs text-white uppercase tracking-wider">Incoming Strategic Communications</h4>
                      <span className="text-[9px] text-slate-500 font-mono">Count: {emails.length}</span>
                    </div>

                    {emails.length === 0 ? (
                      <div className="border border-dashed border-white/10 p-8 text-center text-slate-550 font-mono text-xs">
                        No recent matching message payloads discovered inside linked Gmail account.
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                        {emails.map((msg: any) => {
                          const headers = msg.payload?.headers || [];
                          const fromVal = getHeader(headers, 'From');
                          const subjectVal = getHeader(headers, 'Subject');
                          const dateVal = getHeader(headers, 'Date');

                          return (
                            <div key={msg.id} className="bg-white/5 border border-white/10 p-3.5 hover:bg-white/10 transition-all font-mono">
                              <div className="flex items-center justify-between gap-2 text-[10px] text-slate-450 mb-1 border-b border-white/5 pb-1">
                                <span className="truncate max-w-[150px] font-bold text-cyan-400">{fromVal.replace(/<.*>/, '')}</span>
                                <span className="text-[9px] shrink-0 text-slate-500">{new Date(dateVal).toLocaleDateString()}</span>
                              </div>
                              <h5 className="text-xs text-slate-200 font-bold mb-1 truncate">{subjectVal}</h5>
                              <p className="text-[11px] text-zinc-400 font-sans line-clamp-2 leading-relaxed italic">
                                "{msg.snippet}"
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* T2: CALENDAR */}
              {activeTab === 'calendar' && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                  
                  {/* Scheduling Events */}
                  <div className="bg-white/5 border border-white/10 p-5 space-y-4">
                    <span className="text-[9px] font-mono text-cyan-400 font-bold tracking-widest uppercase block">&bull; SCHEDULE ACTIVE ENGAGEMENT</span>
                    <h4 className="font-mono text-xs text-white uppercase tracking-wider">Sync Calendar Event</h4>
                    
                    <form onSubmit={handleAddCalendarEvent} className="space-y-3 font-mono text-xs">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">MEETING SUBJECT (SUMMARY)</label>
                        <input
                          type="text"
                          required
                          placeholder="Client Intake & Tech Stack Analysis"
                          value={newEvent.summary}
                          onChange={(e)=>setNewEvent({...newEvent, summary: e.target.value})}
                          className="w-full bg-editorial-dark border border-white/10 focus:border-cyan-400 p-2.5 outline-none font-mono text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">AGENDA DETAILES</label>
                        <textarea
                          rows={2}
                          placeholder="Outline specific automation objectives to align with Ocean Tide Drop consulting."
                          value={newEvent.description}
                          onChange={(e)=>setNewEvent({...newEvent, description: e.target.value})}
                          className="w-full bg-editorial-dark border border-white/10 focus:border-cyan-400 p-2.5 outline-none font-mono text-xs text-white text-zinc-300"
                        ></textarea>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">START DATE & TIME</label>
                          <input
                            type="datetime-local"
                            required
                            value={newEvent.start}
                            onChange={(e)=>setNewEvent({...newEvent, start: e.target.value})}
                            className="w-full bg-editorial-dark border border-white/10 focus:border-cyan-400 p-2.5 outline-none font-mono text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">END DATE & TIME</label>
                          <input
                            type="datetime-local"
                            required
                            value={newEvent.end}
                            onChange={(e)=>setNewEvent({...newEvent, end: e.target.value})}
                            className="w-full bg-editorial-dark border border-white/10 focus:border-cyan-400 p-2.5 outline-none font-mono text-xs text-white"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={schedulingEvent}
                        className="w-full bg-cyan-500 hover:bg-cyan-600 text-black py-2.5 text-xs font-mono font-black tracking-widest uppercase cursor-pointer flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                      >
                        {schedulingEvent ? (
                          <Loader2 className="w-4 h-4 animate-spin text-black" />
                        ) : (
                          <Plus className="w-3.5 h-3.5 text-black" />
                        )}
                        SCHEDULE CALENDAR EVENT
                      </button>
                    </form>
                  </div>

                  {/* Calendar Event lists */}
                  <div className="space-y-4">
                    <h4 className="font-mono text-xs text-white uppercase tracking-wider">Scheduled Operational Events</h4>
                    
                    {events.length === 0 ? (
                      <div className="border border-dashed border-white/10 p-8 text-center text-slate-550 font-mono text-xs">
                        No upcoming calendar events detected inside primary calendar node.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {events.map((evt: any) => {
                          const startStr = evt.start?.dateTime || evt.start?.date || '';
                          const dateObj = startStr ? new Date(startStr) : null;
                          return (
                            <div key={evt.id} className="bg-white/5 border border-white/10 p-3.5 flex items-start justify-between gap-4 font-mono">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-cyan-400 text-[10px]">
                                  <Clock className="w-3 h-3 shrink-0" />
                                  <span>{dateObj ? dateObj.toLocaleString() : 'All-Day'}</span>
                                </div>
                                <h5 className="text-xs text-slate-200 font-bold uppercase">{evt.summary}</h5>
                                {evt.description && (
                                  <p className="text-[11px] text-zinc-400 font-sans mt-1">{evt.description}</p>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDeleteCalendarEvent(evt.id)}
                                className="p-1 px-2 border border-red-900/40 hover:bg-red-900/20 text-red-400 text-[10px] cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* T3: TASKS */}
              {activeTab === 'tasks' && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                  
                  {/* Creating Tasks */}
                  <div className="bg-white/5 border border-white/10 p-5 space-y-4">
                    <span className="text-[9px] font-mono text-cyan-400 font-bold tracking-widest uppercase block">&bull; QUEUE ACTIVE ACTIONS</span>
                    <h4 className="font-mono text-xs text-white uppercase tracking-wider">Add Strategic Todo</h4>
                    
                    <form onSubmit={handleAddTask} className="space-y-3 font-mono text-xs">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">TASK OBJECTIVE *</label>
                        <input
                          type="text"
                          required
                          placeholder="Initialize enterprise slack routing triggers"
                          value={newTaskTitle}
                          onChange={(e)=>setNewTaskTitle(e.target.value)}
                          className="w-full bg-editorial-dark border border-white/10 focus:border-cyan-400 p-2.5 outline-none font-mono text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">SUPPORTING NOTES</label>
                        <textarea
                          rows={2}
                          placeholder="Integrate custom cloud functions and verify parameters..."
                          value={newTaskNotes}
                          onChange={(e)=>setNewTaskNotes(e.target.value)}
                          className="w-full bg-editorial-dark border border-white/10 focus:border-cyan-400 p-2.5 outline-none font-mono text-xs text-white"
                        ></textarea>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">DUE DEADLINE (OPTIONAL)</label>
                        <input
                          type="date"
                          value={newTaskDue}
                          onChange={(e)=>setNewTaskDue(e.target.value)}
                          className="w-full bg-editorial-dark border border-white/10 focus:border-cyan-400 p-2.5 outline-none font-mono text-xs text-white"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={addingTask}
                        className="w-full bg-cyan-400 hover:bg-cyan-500 text-black py-2.5 text-xs font-mono font-black tracking-widest uppercase cursor-pointer flex items-center justify-center gap-2 transition-all"
                      >
                        {addingTask ? (
                          <Loader2 className="w-4 h-4 animate-spin text-black" />
                        ) : (
                          <Plus className="w-3.5 h-3.5 text-black" />
                        )}
                        ADD NEW GOOGLE TASK
                      </button>
                    </form>
                  </div>

                  {/* Tasks list */}
                  <div className="space-y-4">
                    <h4 className="font-mono text-xs text-white uppercase tracking-wider">Pending Tasks</h4>
                    
                    {tasks.length === 0 ? (
                      <div className="border border-dashed border-white/10 p-8 text-center text-slate-550 font-mono text-xs">
                        No active Google Task items found for default list.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {tasks.map((task: any) => (
                          <div key={task.id} className="bg-white/5 border border-white/10 p-3.5 flex items-center justify-between gap-4 font-mono">
                            <div className="min-w-0">
                              <h5 className="text-xs text-slate-100 font-bold truncate uppercase">{task.title}</h5>
                              {task.notes && (
                                <p className="text-[11px] text-slate-400 font-sans mt-0.5">{task.notes}</p>
                              )}
                              {task.due && (
                                <p className="text-[10px] text-cyan-400 mt-1">
                                  Due: {new Date(task.due).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleCompleteTask(task.id)}
                                className="p-1 border border-cyan-400 hover:bg-cyan-400/20 text-cyan-300 text-[10px] cursor-pointer flex items-center gap-1"
                              >
                                <Check className="w-3 h-3 text-cyan-300" />
                                Done
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteTask(task.id)}
                                className="p-1 border border-red-900/40 hover:bg-red-900/20 text-red-400 text-[10px] cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* T4: KEEP NOTES (FIRESTORE) */}
              {activeTab === 'keep' && (
                <div className="space-y-6">
                  
                  {/* Keep Creating card */}
                  <div className="bg-white/5 border border-white/10 p-5 space-y-4 max-w-xl">
                    <span className="text-[9px] font-mono text-cyan-400 font-bold tracking-widest uppercase block">&bull; FIRESTORE SYNCHRONIZATION</span>
                    <h4 className="font-mono text-xs text-white uppercase tracking-wider">Create Keep Strategy Note</h4>
                    
                    <form onSubmit={handleAddKeepNote} className="space-y-3 font-mono text-xs">
                      <div>
                        <input
                          type="text"
                          required
                          placeholder="Note Title (e.g., Q3 Cloud Strategy Blueprint)"
                          value={newNote.title}
                          onChange={(e)=>setNewNote({...newNote, title: e.target.value})}
                          className="w-full bg-editorial-dark border border-white/10 focus:border-cyan-400 p-2.5 outline-none font-mono text-xs text-white font-bold"
                        />
                      </div>
                      <div>
                        <textarea
                          rows={3}
                          required
                          placeholder="Write key strategies, outline automation ideas..."
                          value={newNote.content}
                          onChange={(e)=>setNewNote({...newNote, content: e.target.value})}
                          className="w-full bg-editorial-dark border border-white/10 focus:border-cyan-400 p-2.5 outline-none font-sans text-xs text-white text-zinc-300"
                        ></textarea>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <label className="text-[10px] text-slate-400">CARD THEME Color:</label>
                          <select
                            value={newNote.color}
                            onChange={(e)=>setNewNote({...newNote, color: e.target.value})}
                            className="bg-editorial-dark border border-white/10 p-1 font-mono text-[10px] text-white"
                          >
                            <option value="#1e1b4b">Space Indigo</option>
                            <option value="#064e3b">Emerald Slate</option>
                            <option value="#7c2d12">Fiery Rust</option>
                            <option value="#083344">Cyber Cyan</option>
                            <option value="#581c87">Regal Purple</option>
                          </select>
                        </div>
                        <button
                          type="submit"
                          className="bg-cyan-400 hover:bg-cyan-500 text-black py-1.5 px-4 text-xs font-mono font-black tracking-widest uppercase cursor-pointer"
                        >
                          Sync Note
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Loop Notes */}
                  <div className="space-y-3">
                    <h4 className="font-mono text-xs text-white uppercase tracking-wider">Active Keep Notes Index ({notes.length})</h4>
                    
                    {notes.length === 0 ? (
                      <div className="border border-dashed border-white/10 p-8 text-center text-slate-550 font-mono text-xs">
                        No Keep strategic notes available. Create one above to persist in Firebase database.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {notes.map((note) => (
                          <div 
                            key={note.id} 
                            style={{ backgroundColor: note.color }}
                            className="border border-white/15 p-4 flex flex-col justify-between min-h-[160px] font-mono hover:scale-[1.01] transition-all"
                          >
                            <div className="space-y-2">
                              <h5 className="text-xs font-bold text-white uppercase border-b border-white/10 pb-1.5">{note.title}</h5>
                              <p className="text-[11px] text-zinc-200 font-sans leading-relaxed whitespace-pre-line">{note.content}</p>
                            </div>
                            <div className="flex items-center justify-between mt-4 pt-2 border-t border-white/10 text-[9px] text-zinc-300">
                              <span>ACTIVE SYNC</span>
                              <button
                                type="button"
                                onClick={() => handleDeleteKeepNote(note.id)}
                                className="text-red-400 hover:text-red-200 p-1 flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* T5: GOOGLE FORMS */}
              {activeTab === 'forms' && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                  
                  {/* paste form container */}
                  <div className="bg-white/5 border border-white/10 p-5 space-y-4">
                    <span className="text-[9px] font-mono text-cyan-400 font-bold tracking-widest uppercase block">&bull; METRIC ANALYSIS PLUGWAY</span>
                    <h4 className="font-mono text-xs text-white uppercase tracking-wider">Acquire Google Form Structure</h4>
                    
                    <form onSubmit={fetchGoogleForm} className="space-y-3 font-mono text-xs">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">GOOGLE FORM ID</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            placeholder="e.g. 1FAIpQLSfD_X..."
                            value={formIdInput}
                            onChange={(e)=>setFormIdInput(e.target.value)}
                            className="flex-1 bg-editorial-dark border border-white/10 focus:border-cyan-400 p-2.5 outline-none font-mono text-xs text-white"
                          />
                          <button
                            type="submit"
                            disabled={formLoading}
                            className="bg-cyan-500 hover:bg-cyan-600 font-black tracking-widest text-[#000000] px-4 uppercase cursor-pointer text-xs"
                          >
                            {formLoading ? 'Acquiring...' : 'Fetch'}
                          </button>
                        </div>
                      </div>
                    </form>

                    <div className="pt-2 border-t border-white/5 space-y-3">
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest">Or Load Preconfigured OTD Campaign Blueprint Forms:</p>
                      <div className="flex flex-wrap gap-2 text-[10px]">
                        <button
                          type="button"
                          onClick={() => loadPredefinedFormTemplate('consultation')}
                          className="bg-white/5 hover:bg-white/10 border border-white/10 py-1.5 px-3 uppercase tracking-wider text-slate-300 cursor-pointer"
                        >
                          OTD Consultation Intake
                        </button>
                        <button
                          type="button"
                          onClick={() => loadPredefinedFormTemplate('feedback')}
                          className="bg-white/5 hover:bg-white/10 border border-white/10 py-1.5 px-3 uppercase tracking-wider text-slate-300 cursor-pointer"
                        >
                          OTD Applet Feedback Sheet
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* form details */}
                  <div className="space-y-4">
                    <h4 className="font-mono text-xs text-white uppercase tracking-wider">Form Blueprint Blueprint Schema</h4>
                    
                    {!fetchedForm ? (
                      <div className="border border-dashed border-white/10 p-8 text-center text-slate-550 font-mono text-xs">
                        Fetch a live Google Form using ID or select one of OTD's preconfigured blueprint templates to inspect.
                      </div>
                    ) : (
                      <div className="bg-white/5 border border-white/10 p-5 space-y-4 font-mono">
                        <div className="border-b border-white/10 pb-2">
                          <span className="text-[8px] text-cyan-400 uppercase font-black tracking-widest">Active Schema: {fetchedForm.formId}</span>
                          <h5 className="text-sm text-white font-bold uppercase mt-1">{fetchedForm.info?.title || "Untitled Form"}</h5>
                          {fetchedForm.info?.description && (
                            <p className="text-[11px] text-zinc-400 font-sans mt-1 leading-relaxed">{fetchedForm.info.description}</p>
                          )}
                        </div>

                        <div className="space-y-3">
                          <p className="text-[10px] text-slate-350 uppercase tracking-widest">Questions Detected ({fetchedForm.items?.length || 0}):</p>
                          <div className="space-y-2">
                            {fetchedForm.items?.map((item: any, idx: number) => (
                              <div key={idx} className="bg-black/20 p-2.5 border border-white/5 flex justify-between items-center text-[11px]">
                                <span className="font-bold text-slate-200 uppercase">{idx + 1}. {item.title}</span>
                                <span className={`text-[8px] px-1.5 py-0.5 rounded ${item.questionItem?.question?.required ? 'bg-red-950 text-red-400 border border-red-900/40' : 'bg-slate-800 text-slate-400'}`}>
                                  {item.questionItem?.question?.required ? 'REQUIRED' : 'OPTIONAL'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                          <a 
                            href={`https://docs.google.com/forms/d/${fetchedForm.formId}/viewform`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[10px] text-cyan-400 hover:underline"
                          >
                            Open Live Form Link <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              )}

            </div>
          )}

        </div>

        {/* Workspace Footer indicator */}
        <div className="border-t border-white/5 pt-4 mt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-500 gap-2">
          <span>Connected Hub Status: <span className="text-cyan-400 font-bold">SECURED</span></span>
          <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-cyan-400" /> AES-256 Transport Encryption Gate</span>
        </div>

      </div>

    </div>
  );
}
