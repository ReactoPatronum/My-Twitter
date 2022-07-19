import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const googleProvider = new GoogleAuthProvider();
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user?.uid,
          email: user?.email,
        });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user]);

  const registerUser = async (email, password) => {
    createUserWithEmailAndPassword(auth, email, password).catch((err) => {
      if (err.message === "Firebase: Error (auth/email-already-in-use).") {
        toast.error("Bu hesap ile daha önce kayıt olunmuş.");
      } else {
        toast.error(err.message);
      }
    });
  };

  const signInUser = async (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((res) => console.log(res))
      .catch((err) => {
        if (err.message === "Firebase: Error (auth/wrong-password).") {
          toast.error("Hotmail yada parola uyuşmuyor");
        } else {
          toast.error(err.message);
        }
      });
  };

  const logOutUser = async () => {
    setUser(null);
    await signOut(auth);
  };

  const forgotPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const signUpWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const contextValue = {
    user,
    signInUser,
    registerUser,
    logOutUser,
    forgotPassword,
    signUpWithGoogle,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      <Toaster />
      {children}
    </AuthContext.Provider>
  );
};
