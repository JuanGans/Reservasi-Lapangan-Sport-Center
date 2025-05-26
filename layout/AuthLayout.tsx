import Head from "next/head";
import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AuthLayoutProps {
  title?: string;
  children: ReactNode;
  isExit?: boolean;
}

const AuthLayout = ({ title, children, isExit = false }: AuthLayoutProps) => {
  return (
    <>
      <Head>
        <title>{`${title} | JTI Sport Center`}</title>
      </Head>

      <div className="relative min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url('/assets/bg/bg1.jpg')` }}>
        <div className="absolute inset-0 backdrop-blur-[6px] bg-black/20 z-0" />
        <AnimatePresence mode="wait">
          {!isExit && (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="relative z-10 w-full max-w-md bg-gray-100 shadow-xl rounded-lg py-10 px-8 scale-85"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default AuthLayout;
