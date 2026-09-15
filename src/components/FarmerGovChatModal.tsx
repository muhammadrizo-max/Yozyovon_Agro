import React, { useState, useRef } from 'react';
import { 
  X, 
  Send, 
  Paperclip, 
  FileText, 
  Image as ImageIcon, 
  Download, 
  User, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { SubsidyApplication, ChatAttachment, ChatMessage } from '../types';
import { useApp } from '../context/AppContext';

interface FarmerGovChatModalProps {
  subsidy: SubsidyApplication | null;
  onClose: () => void;
}

export const FarmerGovChatModal: React.FC<FarmerGovChatModalProps> = ({ subsidy, onClose }) => {
  const { sendSubsidyMessage, approveSubsidy, rejectSubsidy, userRole, currentUser } = useApp();
  const [inputText, setInputText] = useState('');
  const [pendingAttachments, setPendingAttachments] = useState<ChatAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  if (!subsidy) return null;

  const messages = subsidy.messages || [];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

      let fileType: 'image' | 'pdf' | 'doc' | 'archive' | 'file' = 'file';
      if (file.type.startsWith('image/')) fileType = 'image';
      else if (file.type === 'application/pdf') fileType = 'pdf';
      else if (file.name.endsWith('.doc') || file.name.endsWith('.docx')) fileType = 'doc';
      else if (file.name.endsWith('.zip') || file.name.endsWith('.rar')) fileType = 'archive';

      const reader = new FileReader();
      reader.onload = (event) => {
        const newAtt: ChatAttachment = {
          id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: file.name,
          size: sizeStr,
          type: fileType,
          dataUrl: event.target?.result as string
        };
        setPendingAttachments(prev => [...prev, newAtt]);
      };
      reader.readAsDataURL(file);
    }
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePendingAttachment = (id: string) => {
    setPendingAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && pendingAttachments.length === 0) return;

    sendSubsidyMessage(subsidy.id, inputText.trim(), pendingAttachments.length > 0 ? pendingAttachments : undefined);
    setInputText('');
    setPendingAttachments([]);
    
    // Auto scroll down
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const quickTemplates = [
    'Hujjatlar toʻliq qabul qilindi, 2 ish kunida koʻrib chiqiladi.',
    'Joyiga chiqib dalolatnoma tuzish uchun agronom yuborildi.',
    'Iltimos, yer kadastr hujjati va elektr ulanish shartnomasini ilova qiling.',
    'Subsidiya smetasi maʼqullandi, toʻlov hisob raqamiga oʻtkaziladi.'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl max-w-2xl w-full h-[90vh] max-h-[700px] flex flex-col shadow-2xl border border-[#CBD5E1] dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between border-b border-slate-700 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600/30 border border-blue-400/40 text-blue-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">
                  {subsidy.farmerName} bilan rasmiy muloqot
                </h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  subsidy.status === 'tasdiqlandi' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                    : subsidy.status === 'rad_etildi'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {subsidy.status === 'tasdiqlandi' ? '✓ Tasdiqlangan' : subsidy.status === 'rad_etildi' ? '✕ Rad etilgan' : '⏳ Kutilmoqda'}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 flex items-center gap-2 mt-0.5">
                <span>📍 {subsidy.mfyName}</span>
                <span>•</span>
                <span>📋 {subsidy.programTitle}</span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">{subsidy.requestedAmount}</span>
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Yopish"
            id="close-chat-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Banner for Gov Role (Approve / Reject directly from chat) */}
        {userRole === 'davlat' && subsidy.status === 'kutilmoqda' && (
          <div className="bg-blue-50 dark:bg-blue-950/40 border-b border-blue-200 dark:border-blue-800/60 p-2.5 px-4 flex flex-wrap items-center justify-between gap-2 shrink-0 text-xs">
            <div className="flex items-center gap-2 text-blue-900 dark:text-blue-300 font-medium">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Arizani oʻrganish yakunlandimi? Shu yerdan qaror qabul qiling:</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => approveSubsidy(subsidy.id)}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-xs transition-colors shadow-xs"
                id="chat-approve-subsidy-btn"
              >
                ✓ Arizani Tasdiqlash
              </button>
              <button
                onClick={() => rejectSubsidy(subsidy.id)}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded text-xs transition-colors"
                id="chat-reject-subsidy-btn"
              >
                ✕ Rad Etish
              </button>
            </div>
          </div>
        )}

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8FAFC] dark:bg-slate-950">
          {/* Application Info Card */}
          <div className="bg-white dark:bg-slate-900 rounded-lg p-3.5 border border-[#E2E8F0] dark:border-slate-800 text-xs space-y-1.5 shadow-xs">
            <div className="font-bold text-[#0F172A] dark:text-white flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-blue-600">
                <FileSpreadsheet className="w-4 h-4" />
                <span>Subsidiya Murojaati Asosi</span>
              </span>
              <span className="text-[10px] text-[#64748B] font-mono">{subsidy.submittedDate}</span>
            </div>
            <p className="text-[#334155] dark:text-slate-300 font-semibold">{subsidy.programTitle}</p>
            <p className="text-[#64748B] dark:text-slate-400 text-[11px] leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-2 rounded border border-slate-200 dark:border-slate-700">
              "{subsidy.purpose}"
            </p>
          </div>

          {messages.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#64748B] dark:text-slate-400">
              Ushbu ariza boʻyicha hozircha xabarlar yoʻq. Birinchi xabarni yozing yoki fayl biriktiring.
            </div>
          ) : (
            messages.map(msg => {
              const isGovSender = msg.senderRole === 'davlat';
              return (
                <div 
                  key={msg.id}
                  className={`flex flex-col ${isGovSender ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[10px] font-bold text-[#64748B] dark:text-slate-400">
                      {isGovSender ? '🏛️ ' + msg.senderName : '👨‍🌾 ' + msg.senderName}
                    </span>
                    <span className="text-[9px] text-[#94A3B8]">{msg.timestamp}</span>
                  </div>

                  <div className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed shadow-xs ${
                    isGovSender 
                      ? 'bg-blue-600 text-white rounded-tr-xs' 
                      : 'bg-white dark:bg-slate-900 text-[#0F172A] dark:text-slate-100 border border-[#E2E8F0] dark:border-slate-800 rounded-tl-xs'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* Attachments inside message */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-white/20 dark:border-slate-700/60 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider block opacity-80">
                          Biriktirilgan fayllar ({msg.attachments.length}):
                        </span>
                        {msg.attachments.map(att => (
                          <div 
                            key={att.id}
                            className={`flex items-center justify-between gap-3 p-2 rounded-md ${
                              isGovSender 
                                ? 'bg-blue-700/70 text-white hover:bg-blue-700' 
                                : 'bg-[#F8FAFC] dark:bg-slate-800 text-[#0F172A] dark:text-slate-200 border border-[#CBD5E1] dark:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              {att.type === 'pdf' ? (
                                <FileText className="w-4 h-4 text-rose-400 shrink-0" />
                              ) : att.type === 'image' ? (
                                <ImageIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                              ) : (
                                <Paperclip className="w-4 h-4 text-blue-400 shrink-0" />
                              )}
                              <div className="truncate">
                                <p className="font-semibold text-[11px] truncate">{att.name}</p>
                                <span className="text-[9px] opacity-75">{att.size}</span>
                              </div>
                            </div>

                            {att.dataUrl ? (
                              <a 
                                href={att.dataUrl} 
                                download={att.name}
                                className="p-1 rounded hover:bg-black/10 transition-colors shrink-0"
                                title="Faylni yuklab olish"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </a>
                            ) : (
                              <span className="text-[10px] px-2 py-0.5 rounded bg-white/20 font-bold shrink-0">
                                Saqlangan
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Answer Templates (for Gov) */}
        {userRole === 'davlat' && (
          <div className="p-2 px-3 bg-white dark:bg-slate-900 border-t border-[#E2E8F0] dark:border-slate-800 overflow-x-auto flex items-center gap-1.5 shrink-0 text-xs">
            <span className="text-[10px] font-bold text-[#64748B] shrink-0 uppercase tracking-wider">
              Tezkor javoblar:
            </span>
            {quickTemplates.map((tmpl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setInputText(tmpl)}
                className="whitespace-nowrap px-2.5 py-1 rounded bg-[#F8FAFC] dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-[#334155] dark:text-slate-300 hover:text-blue-600 border border-[#CBD5E1] dark:border-slate-700 text-[11px] font-medium transition-colors"
              >
                {tmpl.slice(0, 32)}...
              </button>
            ))}
          </div>
        )}

        {/* Pending attachments preview */}
        {pendingAttachments.length > 0 && (
          <div className="p-2 px-4 bg-amber-50 dark:bg-amber-950/40 border-t border-amber-200 dark:border-amber-800 flex flex-wrap gap-2 shrink-0 text-xs">
            <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 w-full">
              Yuklanayotgan fayllar ({pendingAttachments.length}):
            </span>
            {pendingAttachments.map(att => (
              <div 
                key={att.id}
                className="flex items-center gap-1.5 px-2 py-1 rounded bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-[11px]"
              >
                <Paperclip className="w-3 h-3 text-amber-600" />
                <span className="truncate max-w-[150px] font-medium">{att.name}</span>
                <button 
                  type="button" 
                  onClick={() => removePendingAttachment(att.id)}
                  className="text-rose-500 hover:text-rose-700 p-0.5 ml-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <form 
          onSubmit={handleSendMessage}
          className="p-3 bg-white dark:bg-slate-900 border-t border-[#CBD5E1] dark:border-slate-800 flex items-center gap-2 shrink-0"
        >
          {/* File attach input */}
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileUpload}
            multiple
            className="hidden"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.zip"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-lg border border-[#CBD5E1] dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[#64748B] hover:text-[#0F172A] transition-colors shrink-0"
            title="Fayl biriktirish (PDF, smeta, rasm, kadastr)"
            id="attach-file-btn"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={userRole === 'davlat' ? 'Dehqonga rasmiy koʻrsatma yoki javob yozing...' : 'Davlat organiga xabar yoki tushuntirish yozing...'}
            className="flex-1 px-3.5 py-2 border border-[#CBD5E1] dark:border-slate-700 rounded-lg bg-[#F8FAFC] dark:bg-slate-800 text-[#0F172A] dark:text-white text-xs font-medium focus:outline-hidden focus:border-[#3B82F6]"
            id="chat-message-input"
          />

          <button
            type="submit"
            disabled={!inputText.trim() && pendingAttachments.length === 0}
            className="px-4 py-2 bg-[#0F172A] hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-[#0F172A] text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
            id="send-chat-message-btn"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Yuborish</span>
          </button>
        </form>

      </div>
    </div>
  );
};
