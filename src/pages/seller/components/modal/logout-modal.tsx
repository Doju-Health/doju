import { Button } from "@/components/ui/button";
import { Modal, ModalContent, ModalTrigger } from "@/components/ui/modal";
import { removeStoredTokens } from "@/lib/local-storage";
import { ReactNode, useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/slice/auth/auth-slice";
import { queryClient } from "@/lib/react-query";

export const LogOutModal = ({
  children,
}: {
  setOpenSidebar: (open: boolean) => void;
  children: ReactNode;
}) => {
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    removeStoredTokens();
    dispatch(logout());
    queryClient.clear();
  };

  return (
    <Modal open={logoutModalOpen} onOpenChange={setLogoutModalOpen}>
      <ModalTrigger asChild onClick={() => setLogoutModalOpen(true)}>
        {children}
      </ModalTrigger>
      <ModalContent
        // onInteractOutside={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="flex flex-col items-center space-y-6 justify-center gap-0 px-8 sm:max-w-[450px] bg-white"
      >
        <div className="font-neue font-norma">
          Are you sure you want to Log out?
        </div>
        <div className="grid grid-cols-2 items-center gap-4 mt w-full mt-4">
          <Button onClick={() => setLogoutModalOpen(false)} variant="secondary">
            Cancel
          </Button>
          <Button onClick={handleLogout} variant="doju-primary">
            Logout
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};
