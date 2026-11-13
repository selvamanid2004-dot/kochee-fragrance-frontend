import React, { useState } from 'react';
import { Mail, CheckCircle2, Clock, Trash2, Search, MessageSquare } from 'lucide-react';
import { contactService } from '../../services/contactService';

export default function AdminInquiriesView({
  contacts = [],
  onRefresh,
  setActionMessage
}) {
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const filteredContacts = contacts.filter((c) => {
    return (
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.subject && c.subject.toLowerCase().includes(search.toLowerCase())) ||
      (c.message && c.message.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const handleToggleStatus = async (id, currentStatus) => {
    setUpdatingId(id);
    const newStatus = currentStatus === 'replied' ? 'pending' : 'replied';
    try {
      await contactService.updateContactStatus(id, newStatus);
      setActionMessage(`Inquiry marked as ${newStatus.toUpperCase()}`);
      onRefresh();
    } catch (err) {
      alert(err.message || 'Failed to update contact status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Filter Bar */}
      <div className="bg-[#13171f] border border-[#1e2430] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search inquiries by name, email, subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#181d26] border border-[#232936] rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="text-xs text-gray-400">
          Total messages: <strong className="text-white font-mono">{filteredContacts.length}</strong>
        </div>
      </div>

      {/* 2. Inquiries Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredContacts.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-xs col-span-2 bg-[#13171f] border border-[#1e2430] rounded-2xl">
            No customer inquiries found.
          </div>
        ) : (
          filteredContacts.map((c) => (
            <div
              key={c.id}
              className={`bg-[#13171f] border rounded-2xl p-5 space-y-4 shadow-xl transition flex flex-col justify-between ${
                c.status === 'replied'
                  ? 'border-[#1e2430] opacity-80'
                  : 'border-amber-500/30'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#1e2430] flex items-center justify-center text-amber-300 font-bold text-xs">
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{c.name}</h4>
                      <p className="text-[11px] text-gray-400 font-mono">{c.email}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      c.status === 'replied'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {c.status || 'pending'}
                  </span>
                </div>

                {c.subject && (
                  <p className="text-xs font-bold text-amber-300 mt-3">
                    Subject: {c.subject}
                  </p>
                )}

                <div className="mt-2 p-3.5 rounded-xl bg-[#171c24] border border-[#232936] text-xs text-gray-300 leading-relaxed font-sans">
                  "{c.message}"
                </div>
              </div>

              <div className="pt-3 border-t border-[#1e2430] flex items-center justify-between text-xs text-gray-400">
                <span className="text-[10px] font-mono text-gray-500">
                  {new Date(c.created_at).toLocaleString('en-IN')}
                </span>

                <button
                  onClick={() => handleToggleStatus(c.id, c.status)}
                  disabled={updatingId === c.id}
                  className="px-3 py-1.5 rounded-lg bg-[#181d26] hover:bg-[#202632] text-xs font-bold text-gray-300 hover:text-white transition"
                >
                  {c.status === 'replied' ? 'Mark as Pending' : 'Mark as Responded'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

