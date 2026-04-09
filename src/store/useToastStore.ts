import { create } from 'zustand';

export type ToastKind = 'info' | 'success' | 'error';
export type Toast = { id: string; kind: ToastKind; text: string };

type State = { toasts: Toast[] };
type Actions = {
  push: (text: string, kind?: ToastKind) => void;
  dismiss: (id: string) => void;
};

export const useToastStore = create<State & Actions>((set, get) => ({
  toasts: [],
  push: (text, kind = 'info') => {
    const id = crypto.randomUUID();
    set((s) => ({ toasts: [...s.toasts, { id, text, kind }] }));
    setTimeout(() => get().dismiss(id), 3500);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export const toast = {
  info: (text: string) => useToastStore.getState().push(text, 'info'),
  success: (text: string) => useToastStore.getState().push(text, 'success'),
  error: (text: string) => useToastStore.getState().push(text, 'error'),
};
