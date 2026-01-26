import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Home, AlertTriangle } from "lucide-react";
import { Button } from "@/app/core/components/ui/button";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-100/60 dark:bg-blue-950/40 mb-6"
        >
          <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 dark:text-blue-300" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-6xl sm:text-7xl font-bold text-slate-900 dark:text-white mb-4"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-3"
        >
          Page Not Found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mb-8"
        >
          The page you're looking for doesn't exist or has been moved.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="h-11 px-6 rounded-full"
          >
            Go Back
          </Button>
          <Button
            onClick={() => navigate("/")}
            className="h-11 px-6 rounded-full"
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default NotFound;
