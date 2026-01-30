import { AlertTriangle, Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/core/components/ui/alert-dialog";
import type { User } from "@/app/core/interfaces/dashboard.interface";

type DeleteUserDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onConfirm: () => void;
  isDeleting?: boolean;
};

export function DeleteUserDialog({
  open,
  onOpenChange,
  user,
  onConfirm,
  isDeleting = false,
}: DeleteUserDialogProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-red-600" />
            Delete User
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{user?.name}"? This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-red-800 dark:text-red-200 mb-1">
                  This action is permanent
                </p>
                <p className="text-red-700 dark:text-red-300">
                  Deleting this user will remove all associated data and cannot
                  be reversed. The user will lose access to the system
                  immediately.
                </p>
              </div>
            </div>
          </div>

          {user && (
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
              <div className="text-sm space-y-1">
                <p>
                  <strong>Name:</strong> {user.name}
                </p>
                <p>
                  <strong>Username:</strong> {user.username}
                </p>
                <p>
                  <strong>User Type:</strong> {user.userType}
                </p>
                <p>
                  <strong>Agent Code:</strong> {user.agentCode}
                </p>
              </div>
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? "Deleting..." : "Delete User"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
