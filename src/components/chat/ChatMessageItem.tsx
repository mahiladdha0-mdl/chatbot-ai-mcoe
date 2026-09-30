import React, { useState } from 'react';
import { ChatMessage, AcademicSubject, FacultyMember } from '../../types';
import {
  Bot,
  User as UserIcon,
  Mail,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
  Sparkles,
  Info,
  Clock,
  Briefcase,
  GraduationCap,
} from 'lucide-react';

interface ChatMessageItemProps {
  message: ChatMessage;
  onSuggestionClick: (suggestion: string) => void;
  onSubjectClick?: (subject: AcademicSubject) => void;
  onViewFacultyDirectory?: () => void;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  onSuggestionClick,
  onSubjectClick,
  onViewFacultyDirectory,
}) => {
  const isUser = message.sender === 'user';
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const handleCopy = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedEmail(text);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  return (
    <div
      className={`flex items-start gap-3 sm:gap-4 ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      } py-2`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold shadow-xs ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gradient-to-tr from-blue-700 via-indigo-600 to-violet-600 text-white'
        }`}
      >
        {isUser ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Message Content Container */}
      <div className={`max-w-[85%] sm:max-w-[80%] space-y-3 ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Main Text Bubble */}
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
            isUser
              ? 'bg-blue-600 text-white rounded-tr-xs shadow-xs font-normal'
              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-xs shadow-xs whitespace-pre-line'
          }`}
        >
          {message.text}
        </div>

        {/* Attached Subject Cards (if any) */}
        {message.subjectCards && message.subjectCards.length > 0 && (
          <div className="space-y-2 pt-1">
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>Curriculum Course Details ({message.subjectCards.length})</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {message.subjectCards.map(subj => {
                const isLab = subj.type === 'laboratory';
                const isElective = subj.type === 'elective';

                return (
                  <div
                    key={subj.id}
                    onClick={() => onSubjectClick && onSubjectClick(subj)}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer group space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-1 text-[11px]">
                      <span className="font-mono font-bold text-blue-700 dark:text-blue-400">
                        {subj.code}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          isLab
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : isElective
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        }`}
                      >
                        {isLab ? 'Laboratory' : isElective ? 'Elective' : 'Core'}
                      </span>
                    </div>

                    <div className="font-semibold text-xs text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {subj.name}
                    </div>

                    {subj.description && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight">
                        {subj.description}
                      </p>
                    )}

                    {isElective && subj.notes && (
                      <div className="text-[10px] text-purple-700 dark:text-purple-300 font-medium">
                        • {subj.notes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Attached Faculty Cards (if any) */}
        {message.facultyCards && message.facultyCards.length > 0 && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                <span>Department Faculty Details</span>
              </span>
              {onViewFacultyDirectory && (
                <button
                  onClick={onViewFacultyDirectory}
                  className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 normal-case text-xs font-semibold cursor-pointer"
                >
                  <span>Open Full Directory</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {message.facultyCards.map(fac => (
                <div
                  key={fac.id}
                  className={`p-3.5 rounded-xl border ${
                    fac.isHod
                      ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-900/90 border-slate-200 dark:border-slate-700/80'
                  } space-y-2`}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        fac.isHod
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {fac.initials || fac.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
                        <span>{fac.name}</span>
                      </div>
                      <div className="text-[11px] font-medium text-blue-700 dark:text-blue-400">
                        {fac.isHod ? 'Head of Department — AIDS' : fac.designation}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        {fac.qualification}
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>Teaching: {fac.teachingExperience}</span>
                    </div>
                    {fac.industryExperience && (
                      <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-medium">
                        <Briefcase className="w-3 h-3 shrink-0" />
                        <span>Industry: {fac.industryExperience}</span>
                      </div>
                    )}
                  </div>

                  {/* Email & Action */}
                  <div className="pt-1.5 flex items-center justify-between text-xs">
                    <a
                      href={`mailto:${fac.email}`}
                      className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 truncate max-w-[180px]"
                    >
                      <Mail className="w-3 h-3 shrink-0" />
                      <span className="truncate">{fac.email}</span>
                    </a>

                    <button
                      onClick={e => handleCopy(fac.email, e)}
                      title="Copy email address"
                      className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                    >
                      {copiedEmail === fac.email ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Follow-up Chips */}
        {message.suggestedFollowUps && message.suggestedFollowUps.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-500" />
              <span>Suggested Next Questions:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {message.suggestedFollowUps.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => onSuggestionClick(suggestion)}
                  className="text-left text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 border border-slate-200/80 dark:border-slate-700 transition-colors cursor-pointer"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Timestamp */}
        <div
          className={`text-[10px] text-slate-400 px-1 ${
            isUser ? 'text-right' : 'text-left'
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
};
