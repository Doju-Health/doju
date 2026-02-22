import { Button } from "@/components/ui/button";
import { Modal, ModalContent, ModalTrigger } from "@/components/ui/modal";
import { removeStoredTokens } from "@/lib/local-storage";
import { LogOutIcon } from "lucide-react";
// import { logout } from "@/redux/features/auth/auth-slice";
import { ReactNode, useState } from "react";
import { useNavigate } from "react-router";

export const LogOutModal = ({
  setOpenSidebar,
  children,
}: {
  setOpenSidebar: (open: boolean) => void;
  children: ReactNode;
}) => {
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    removeStoredTokens();
    setOpenSidebar(false);
    navigate("/auth");
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
          <Button onClick={handleLogout} variant="doju-primary">Logout</Button>
        </div>
      </ModalContent>
    </Modal>
  );
};
