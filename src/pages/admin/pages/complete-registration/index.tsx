import { useParams, useNavigate } from "react-router-dom";
import { Lock, Mail, ShieldCheck } from "lucide-react";
import { CustomInput } from "@/components/ui/input/custom-input";
import { Button } from "@/components/ui/button";
import { useFormHandler } from "@/hooks/use-form-handler";
import * as yup from "yup";
import { useCompleteAdminRegistration } from "../../api/use-complete-admin-registration";
import DojuLogo from "@/assets/doju-logo.png";

export default function AdminCompleteRegistration() {
  const { email: encodedEmail = "" } = useParams<{ email: string }>();
  const email = decodeURIComponent(encodedEmail);
  const navigate = useNavigate();
  const { mutate: completeRegistration, isPending } =
    useCompleteAdminRegistration();

  const { values, errors, touched, handleChange, handleSubmit } =
    useFormHandler({
      initialValues: { password: "", confirmPassword: "" },
      validationSchema: yup.object({
        password: yup
          .string()
          .min(8, "Password must be at least 8 characters")
          .required("Password is required"),
        confirmPassword: yup
          .string()
          .oneOf([yup.ref("password")], "Passwords do not match")
          .required("Please confirm your password"),
      }),
      onSubmit: () => {
        completeRegistration(
          { email, password: values.password },
          {
            onSuccess: () => {
              navigate("/admin/login");
            },
          },
        );
      },
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 flex items-center justify-center p-4 w-full">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        {/* Header */}
        <div className="text-center mb-6">
          <img
            src={DojuLogo}
            alt="DOJU"
            className="h-10 w-auto mx-auto mb-4 object-contain"
          />
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-doju-lime text-slate-900">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Complete your setup
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Set a password to activate your admin account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email — read-only, derived from URL */}
          <CustomInput
            name="email"
            label="Email address"
            type="email"
            value={email}
            readOnly
            disabled
            leftIcon={<Mail className="size-4 text-slate-400" />}
            leftIconCls="pl-10"
            className="bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed"
          />

          <CustomInput
            name="password"
            label="New password"
            type="password"
            value={values.password}
            onChange={handleChange}
            leftIcon={<Lock className="size-4 text-slate-400" />}
            leftIconCls="pl-10"
            error={touched.password && errors.password}
            placeholder="At least 8 characters"
            className="bg-slate-50 text-slate-900 border-slate-300 focus:border-doju-lime"
          />

          <CustomInput
            name="confirmPassword"
            label="Confirm password"
            type="password"
            value={values.confirmPassword}
            onChange={handleChange}
            leftIcon={<Lock className="size-4 text-slate-400" />}
            leftIconCls="pl-10"
            error={touched.confirmPassword && errors.confirmPassword}
            placeholder="Re-enter your password"
            className="bg-slate-50 text-slate-900 border-slate-300 focus:border-doju-lime"
          />

          <Button
            type="submit"
            className="w-full"
            variant="doju-primary"
            isLoading={isPending}
          >
            Activate account
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Already set up?{" "}
          <button
            type="button"
            onClick={() => navigate("/admin/login")}
            className="text-doju-lime hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
