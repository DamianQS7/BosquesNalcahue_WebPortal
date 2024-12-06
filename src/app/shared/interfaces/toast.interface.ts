export type ToastType = 'success' | 'failure';

export type ToastContent = Omit<ToastState, 'visible'>;

export interface ToastState {
    toastType: ToastType;
    visible: boolean;
    message: string | null;
}