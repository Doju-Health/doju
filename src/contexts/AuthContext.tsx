import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
  };
}

interface Session {
  user: User;
  access_token: string;
}

type AppRole = "admin" | "buyer" | "seller" | "dispatch";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  roles: AppRole[];
  isAdmin: boolean;
  isSeller: boolean;
  isBuyer: boolean;
  isDispatch: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    fullName?: string,
  ) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demo purposes
const mockUsers: Record<
  string,
  { password: string; fullName: string; role: AppRole }
> = {
  "admin@test.com": {
    password: "admin123",
    fullName: "Admin User",
    role: "admin",
  },
  "seller@test.com": {
    password: "seller123",
    fullName: "Seller User",
    role: "seller",
  },
  "buyer@test.com": {
    password: "buyer123",
    fullName: "Buyer User",
    role: "buyer",
  },
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<AppRole[]>([]);
  
  useEffect(() => {
    // Load session from localStorage on mount
    const savedSession = localStorage.getItem("auth_session");
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        setSession(parsed.session);
        setUser(parsed.session.user);
        if (parsed.role) {
          setRoles([parsed.role]); 
        }
      } catch (e) {
        console.error("Error loading session:", e);
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const mockUser = mockUsers[email];
      if (!mockUser || mockUser.password !== password) {
        return { error: new Error("Invalid login credentials") };
      }

      const newUser: User = {
        id: `user-${Date.now()}`,
        email: email,
        user_metadata: { full_name: mockUser.fullName },
      };

      const newSession: Session = {
        user: newUser,
        access_token: `token-${Date.now()}`,
      };

      setUser(newUser);
      setSession(newSession);
      setRoles([mockUser.role]);
      localStorage.setItem(
        "auth_session",
        JSON.stringify({ session: newSession, role: mockUser.role }),
      );
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      if (mockUsers[email]) {
        return { error: new Error("Email already registered") };
      }

      const newUser: User = {
        id: `user-${Date.now()}`,
        email: email,
        user_metadata: { full_name: fullName },
      };

      const newSession: Session = {
        user: newUser,
        access_token: `token-${Date.now()}`,
      };

      // Add to mock users
      mockUsers[email] = {
        password,
        fullName: fullName || "User",
        role: "buyer",
      };

      setUser(newUser);
      setSession(newSession);
      setRoles(["buyer"]);
      localStorage.setItem(
        "auth_session",
        JSON.stringify({ session: newSession, role: "buyer" }),
      );
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
    setRoles([]);
    localStorage.removeItem("auth_session");
  };

  const isAdmin = roles.includes("admin");
  const isSeller = roles.includes("seller");
  const isBuyer = roles.includes("buyer");
  const isDispatch = roles.includes("dispatch");

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        roles,
        isAdmin,
        isSeller,
        isBuyer,
        isDispatch,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
