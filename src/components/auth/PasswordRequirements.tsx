import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PASSWORD_RULES } from "@/lib/password-policy";

interface PasswordRequirementsProps {
  password: string;
  /** Hide the checklist until the user starts typing. */
  showWhenEmpty?: boolean;
  className?: string;
}

/**
 * Live checklist of the password policy, so the user can see exactly which
 * requirement they have not met yet instead of guessing from one error string.
 */
export const PasswordRequirements = ({
  password,
  showWhenEmpty = false,
  className,
}: PasswordRequirementsProps) => {
  if (!password && !showWhenEmpty) return null;

  return (
    <ul
      className={cn("mt-3 space-y-1.5", className)}
      aria-label="Password requirements"
    >
      {PASSWORD_RULES.map((rule) => {
        const met = rule.test(password ?? "");

        return (
          <li
            key={rule.id}
            className={cn(
              "flex items-start gap-2 text-xs transition-colors",
              met ? "text-green-600 dark:text-green-500" : "text-muted-foreground",
            )}
          >
            {met ? (
              <Check className="h-3.5 w-3.5 mt-px flex-shrink-0" />
            ) : (
              <X className="h-3.5 w-3.5 mt-px flex-shrink-0" />
            )}
            <span>{rule.label}</span>
            <span className="sr-only">{met ? " — met" : " — not met"}</span>
          </li>
        );
      })}
    </ul>
  );
};

export default PasswordRequirements;
