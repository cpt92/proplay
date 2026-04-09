import { useToastStore } from '../store/useToastStore';

const STYLE = {
  info: 'border-accent-primary/40 bg-accent-primary/10 text-accent-primary',
  success: 'border-ok/40 bg-ok/10 text-ok',
  error: 'border-err/40 bg-err/10 text-err',
};

export default function ToastHost() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex w-full max-w-sm flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => dismiss(t.id)}
          className={`pointer-events-auto cursor-pointer rounded-xl border bg-bg-secondary/95 px-4 py-3 text-sm shadow-2xl shadow-black/40 backdrop-blur transition animate-pop-in ${STYLE[t.kind]}`}
        >
          {t.text}
        </div>
      ))}
    </div>
  );
}
