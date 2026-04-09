import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuthStore } from '../store/useAuthStore';
import { useBookingsStore } from '../store/useBookingsStore';
import { useAthletesStore } from '../store/useAthletesStore';
import { useChatStore } from '../store/useChatStore';

export default function Messages() {
  const [params, setParams] = useSearchParams();
  const user = useAuthStore((s) =>
    s.currentUserId ? s.users.find((u) => u.id === s.currentUserId) ?? null : null
  );
  const bookings = useBookingsStore((s) => s.bookings);
  const athletes = useAthletesStore((s) => s.athletes);
  const messages = useChatStore((s) => s.messages);
  const send = useChatStore((s) => s.send);

  const [text, setText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Conversations: bookings I'm involved in (and not declined/cancelled)
  const myBookings = useMemo(() => {
    if (!user) return [];
    return bookings.filter((b) => {
      if (b.status === 'declined' || b.status === 'cancelled') return false;
      if (user.role === 'fan') return b.fanId === user.id;
      const a = athletes.find((x) => x.id === b.athleteId);
      return a?.ownerUserId === user.id;
    });
  }, [bookings, athletes, user]);

  const activeId = params.get('booking') ?? myBookings[0]?.id ?? null;
  const activeBooking = myBookings.find((b) => b.id === activeId);
  const activeAthlete = activeBooking ? athletes.find((a) => a.id === activeBooking.athleteId) : null;
  const thread = useMemo(
    () =>
      activeId
        ? messages.filter((m) => m.bookingId === activeId).sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))
        : [],
    [messages, activeId]
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [thread.length]);

  if (!user) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeId || !text.trim()) return;
    send(activeId, user.id, text);
    setText('');
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 animate-fade-in">
      <h1 className="mb-6 text-3xl font-extrabold">Messages</h1>

      {myBookings.length === 0 ? (
        <div className="card text-center text-ink-muted">
          No conversations yet. Once a booking is made, a thread will appear here.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-[280px_1fr]">
          {/* Conversation list */}
          <div className="card space-y-1 p-2 md:max-h-[600px] md:overflow-y-auto">
            {myBookings.map((b) => {
              const a = athletes.find((x) => x.id === b.athleteId);
              const other = user.role === 'fan' ? a?.name : b.fanName;
              const last = [...messages].reverse().find((m) => m.bookingId === b.id);
              return (
                <button
                  key={b.id}
                  onClick={() => setParams({ booking: b.id })}
                  className={`flex w-full items-start gap-3 rounded-lg p-3 text-left transition ${
                    activeId === b.id ? 'bg-accent-primary/20' : 'hover:bg-white/5'
                  }`}
                >
                  {a && <img src={a.photo} alt="" className="h-10 w-10 flex-shrink-0 rounded-lg object-cover" />}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">{other}</div>
                    <div className="truncate text-xs text-ink-muted">{b.experienceTitle}</div>
                    <div className="truncate text-xs text-ink-muted">
                      {last ? last.text : 'No messages yet'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Chat window */}
          <div className="card flex h-[600px] flex-col p-0">
            {activeBooking && activeAthlete ? (
              <>
                <div className="flex items-center gap-3 border-b border-white/10 p-4">
                  <img src={activeAthlete.photo} alt="" className="h-10 w-10 rounded-lg object-cover" />
                  <div>
                    <div className="font-semibold">
                      {user.role === 'fan' ? activeAthlete.name : activeBooking.fanName}
                    </div>
                    <div className="text-xs text-ink-muted">
                      {activeBooking.experienceTitle} · {format(new Date(activeBooking.date), 'MMM d')} · {activeBooking.time}
                    </div>
                  </div>
                  <span className="ml-auto chip capitalize">{activeBooking.status}</span>
                </div>

                <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
                  {thread.length === 0 && (
                    <div className="text-center text-sm text-ink-muted">
                      Say hi 👋 — start the conversation.
                    </div>
                  )}
                  {thread.map((m) => {
                    const mine = m.fromUserId === user.id;
                    return (
                      <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                            mine
                              ? 'bg-hero-gradient text-white'
                              : 'border border-white/10 bg-bg-secondary/60 text-ink-primary'
                          }`}
                        >
                          {m.text}
                          <div className={`mt-1 text-[10px] ${mine ? 'text-white/70' : 'text-ink-muted'}`}>
                            {format(new Date(m.createdAt), 'h:mm a')}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <form onSubmit={handleSend} className="flex gap-2 border-t border-white/10 p-3">
                  <input
                    className="input flex-1"
                    placeholder="Type a message…"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                  <button type="submit" disabled={!text.trim()} className="btn-primary !px-4 !py-2 text-sm disabled:opacity-50">
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center text-sm text-ink-muted">
                Select a conversation
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
