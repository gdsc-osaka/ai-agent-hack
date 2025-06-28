import { useRef, useState } from "react";

interface ConfirmDialogState {
  isOpen: boolean;
  open: () => void;
  openAsync: () => Promise<boolean>;
  handleOk: () => void;
  handleCancel: () => void;
  handleClose: () => void;
}

export const useConfirmDialog = (): ConfirmDialogState => {
  const [isOpen, setIsOpen] = useState(false);
  const resolve = useRef<(bool: boolean) => void>(() => {});
  const reject = useRef<(reason?: unknown) => void>(() => {});

  const open = () => {
    setIsOpen(true);
  };

  const openAsync = (): Promise<boolean> => {
    setIsOpen(true);
    return new Promise((res, rej) => {
      resolve.current = res;
      reject.current = rej;
    });
  };

  const onOk = () => {
    setIsOpen(false);
    resolve.current(true);
  };

  const onCancel = () => {
    setIsOpen(false);
    resolve.current(false);
  };

  const onClose = () => {
    setIsOpen(false);
    reject.current(new Error("Dialog closed without action"));
  };

  return {
    isOpen,
    open,
    openAsync,
    handleOk: onOk,
    handleClose: onClose,
    handleCancel: onCancel,
  };
};
