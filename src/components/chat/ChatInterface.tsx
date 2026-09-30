import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { processUserQuery } from '../../services/chatbotEngine';
import { ChatMessage, Conversation, AcademicSubject } from '../../types';
import { ChatMessageItem } from './ChatMessageItem';
import {
  Bot,
  Sparkles,
  Send,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  BookOpen,
  Users,
  Layers,
  Calendar,
  HelpCircle,
  User as UserIcon,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  MessageSquare,
  GraduationCap,
} from 'lucide-react';

interface ChatInterfaceProps {
  initialQuestion?: string;
  onNavigate: (tab: string, queryParam?: string) => void;
  onSelectSubject?: (subject: AcademicSubject) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  initialQuestion,
  onNavigate,
  onSelectSubject,
}) => {
  const { user, logout } = useAuth();
  const studentName = user?.name || 'Student';
  const studentId = user?.id || 'demo-student';

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize conversations on mount
  useEffect(() => {
    const list = storageService.getConversations(studentId);
    setConversations(list);

    if (list.length > 0) {
      const first = list[0];
      setActiveConvId(first.id);
      setMessages(first.messages);
    } else {
      createNewChat();
    }
  }, [studentId]);

  // Handle initialQuestion prop if passed from dashboard or landing page
  useEffect(() => {
    if (initialQuestion && initialQuestion.trim().length > 0) {
      sendMessage(initialQuestion.trim());
    }
  }, [initialQuestion]);

  // Auto-scroll when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const createNewChat = () => {
    const welcomeMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'assistant',
      text: `Hi ${studentName}! I'm your Modern College AI Assistant. I can help you explore your semester subjects, faculty members, electives, and academic information. What would you like to know?`,
      timestamp: new Date().toISOString(),
      suggestedFollowUps: [
        'What subjects do I have in Semester III?',
        'What subjects do I have in Semester IV?',
        'Who is the HOD of AIDS?',
        'Show me the faculty directory',
      ],
      intent: 'welcome',
    };

    const newConv: Conversation = {
      id: 'conv-' + Date.now(),
      studentId: studentId,
      title: 'New Academic Discussion',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [welcomeMsg],
      context: {},
    };

    storageService.saveConversation(newConv);
    setConversations(prev => [newConv, ...prev]);
    setActiveConvId(newConv.id);
    setMessages([welcomeMsg]);
  };

  const handleSelectConv = (convId: string) => {
    const conv = conversations.find(c => c.id === convId);
    if (conv) {
      setActiveConvId(conv.id);
      setMessages(conv.messages);
    }
  };

  const handleDeleteConv = (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    storageService.deleteConversation(convId);
    const updated = conversations.filter(c => c.id !== convId);
    setConversations(updated);

    if (activeConvId === convId) {
      if (updated.length > 0) {
        setActiveConvId(updated[0].id);
        setMessages(updated[0].messages);
      } else {
        createNewChat();
      }
    }
  };

  const handleStartRename = (conv: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTitleId(conv.id);
    setEditedTitle(conv.title);
  };

  const handleSaveRename = (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editedTitle.trim()) {
      storageService.renameConversation(convId, editedTitle.trim());
      setConversations(prev =>
        prev.map(c => (c.id === convId ? { ...c, title: editedTitle.trim() } : c))
      );
    }
    setEditingTitleId(null);
  };

  const handleCancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTitleId(null);
  };

  const sendMessage = (textToSend?: string) => {
    const content = (textToSend || inputText).trim();
    if (!content || isTyping) return;

    const currentConv = conversations.find(c => c.id === activeConvId);
    const context = currentConv?.context || {};

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: content,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');
    setIsTyping(true);

    // Auto-update conversation title if it was default
    let updatedTitle = currentConv?.title || 'New Discussion';
    if (currentConv && (currentConv.title === 'New Academic Discussion' || currentConv.messages.length <= 1)) {
      updatedTitle = content.length > 32 ? content.slice(0, 30) + '...' : content;
    }

    // Record query in teacher's query management log
    storageService.addQuery({
      studentName: studentName,
      studentEmail: user?.email || 'student@moderncoe.edu.in',
      query: content,
      status: 'answered',
      category: 'Academics',
      responseSnippet: 'Answered via AI Assistant',
    });

    // Simulate natural AI thinking delay
    setTimeout(() => {
      const response = processUserQuery(content, newMessages, context);

      const botMsg: ChatMessage = {
        id: 'msg-' + Date.now() + 1,
        sender: 'assistant',
        text: response.text,
        timestamp: new Date().toISOString(),
        subjectCards: response.subjectCards,
        facultyCards: response.facultyCards,
        suggestedFollowUps: response.suggestedFollowUps,
        intent: response.intent,
      };

      const finalMessages = [...newMessages, botMsg];
      setMessages(finalMessages);
      setIsTyping(false);

      // Save to storage with updated context
      const updatedConv: Conversation = {
        id: activeConvId,
        studentId: studentId,
        title: updatedTitle,
        createdAt: currentConv?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: finalMessages,
        context: {
          ...context,
          ...response.contextUpdates,
        },
      };

      storageService.saveConversation(updatedConv);
      setConversations(prev =>
        prev.map(c => (c.id === activeConvId ? updatedConv : c))
      );
    }, 450);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] max-w-full overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* LEFT SIDEBAR */}
      <aside
        className={`${
          sidebarOpen ? 'w-72 sm:w-80' : 'w-0'
        } transition-all duration-300 ease-in-out shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col z-20 overflow-hidden`}
      >
        {/* Top: New Chat Button */}
        <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <button
            onClick={createNewChat}
            className="flex-1 py-2.5 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Conversations History List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
            Chat History
          </div>

          {conversations.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400">
              No recent conversations
            </div>
          ) : (
            conversations.map(conv => {
              const isActive = conv.id === activeConvId;
              const isEditing = editingTitleId === conv.id;

              return (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConv(conv.id)}
                  className={`group relative flex items-center justify-between p-2 rounded-xl text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-900 dark:text-blue-200 font-semibold border border-blue-200 dark:border-blue-900/60'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1 pr-1">
                    <MessageSquare className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-blue-500" />
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedTitle}
                        onChange={e => setEditedTitle(e.target.value)}
                        className="w-full text-xs px-1 py-0.5 border rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        autoFocus
                        onClick={e => e.stopPropagation()}
                      />
                    ) : (
                      <span className="truncate">{conv.title}</span>
                    )}
                  </div>

                  {/* Actions: Rename / Delete */}
                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    {isEditing ? (
                      <>
                        <button
                          onClick={e => handleSaveRename(conv.id, e)}
                          title="Save"
                          className="p-1 hover:text-emerald-600"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          onClick={handleCancelRename}
                          title="Cancel"
                          className="p-1 hover:text-rose-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={e => handleStartRename(conv, e)}
                          title="Rename"
                          className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={e => handleDeleteConv(conv.id, e)}
                          title="Delete"
                          className="p-1 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar Bottom Nav Links (Exact from spec: Academics, Sem III, Sem IV, Faculty Directory, Help, Profile, Logout) */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-1 text-xs">
          <button
            onClick={() => onNavigate('academics')}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-slate-500" />
            <span>Academics &amp; Syllabi</span>
          </button>

          <button
            onClick={() => onNavigate('academics', 'Semester III')}
            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 transition-colors pl-6 text-[11px]"
          >
            <Layers className="w-3.5 h-3.5 text-blue-500" />
            <span>Semester III</span>
          </button>

          <button
            onClick={() => onNavigate('academics', 'Semester IV')}
            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 transition-colors pl-6 text-[11px]"
          >
            <Calendar className="w-3.5 h-3.5 text-violet-500" />
            <span>Semester IV</span>
          </button>

          <button
            onClick={() => onNavigate('faculty')}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 transition-colors"
          >
            <Users className="w-4 h-4 text-slate-500" />
            <span>Faculty Directory</span>
          </button>

          <button
            onClick={() => onNavigate('about')}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span>Help &amp; Support</span>
          </button>

          {/* User profile & logout */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between px-1">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]">
                {user?.avatar || 'ST'}
              </div>
              <div className="truncate">
                <div className="font-semibold text-slate-900 dark:text-white truncate">
                  {studentName}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {user?.role === 'admin' ? 'Administrator' : 'SE AIDS Student'}
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CHAT CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-slate-950">
        {/* Chat Area Header */}
        <div className="h-14 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Modern College AI Assistant</span>
                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                  AIDS Dept
                </span>
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Ask me anything about your academics, subjects, faculty, or college.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={createNewChat}
              className="px-2.5 py-1 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear Chat</span>
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map(msg => (
              <ChatMessageItem
                key={msg.id}
                message={msg}
                onSuggestionClick={sendMessage}
                onSubjectClick={onSelectSubject}
                onViewFacultyDirectory={() => onNavigate('faculty')}
              />
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-3 py-2 pl-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-violet-600 text-white flex items-center justify-center text-xs font-bold">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3.5 rounded-2xl rounded-tl-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 text-xs text-slate-500">
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce delay-100" />
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce delay-200" />
                  <span className="ml-1 text-[11px]">Assistant is consulting academic knowledge base...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Composer Area */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
          <div className="max-w-3xl mx-auto space-y-2">
            {/* Quick Suggestion Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider shrink-0 mr-1">
                Quick:
              </span>
              {[
                'Who teaches OOP to A division?',
                'Who teaches Operating System?',
                'Who teaches DSA?',
                'Who takes practicals?',
                'Who is the HOD of AIDS?',
                'What subjects do I have in Semester III?',
              ].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(q)}
                  className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/70 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 whitespace-nowrap transition-colors shrink-0 cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Box */}
            <div className="relative rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about Modern College..."
                rows={2}
                className="w-full px-4 py-3 bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden resize-none"
              />

              <div className="flex items-center justify-between px-3 pb-2 pt-1 border-t border-slate-200/40 dark:border-slate-700/40 text-[11px] text-slate-400">
                <span className="hidden sm:inline">
                  Press <strong>Enter</strong> to send, <strong>Shift + Enter</strong> for a new line
                </span>
                <span className="sm:hidden">Enter to send</span>

                <button
                  onClick={() => sendMessage()}
                  disabled={!inputText.trim() || isTyping}
                  className={`p-2 rounded-xl text-white transition-all cursor-pointer ${
                    inputText.trim() && !isTyping
                      ? 'bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-md shadow-blue-500/20'
                      : 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed opacity-60'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
