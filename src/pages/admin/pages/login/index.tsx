import { Lock, Mail } from "lucide-react";
import { CustomInput } from "@/components/ui/input/custom-input";
import { Button } from "@/components/ui/button";
import { useFormHandler } from "@/hooks/use-form-handler";
import * as yup from "yup";

export default function AdminLogin() {
  const { values, errors, touched, handleChange, handleSubmit, resetForm } =
    useFormHandler({
      initialValues: {
        email: "",
        password: "",
      },
      validationSchema: yup.object({
        email: yup
          .string()
          .email("Enter a valid email")
          .required("Email is required"),
        password: yup
          .string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
      }),
      onSubmit: () => {
        // TODO: implement admin login action
      },
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 flex items-center justify-center p-4 w-full">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-doju-lime text-slate-900">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Sign In</h1>
          <p className="mt-2 text-sm text-slate-500">
            Secure access to your Doju admin dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <CustomInput
            name="email"
            label="Email address"
            type="email"
            value={values.email}
            onChange={handleChange}
            leftIcon={<Mail className="size-4 text-slate-400" />}
            leftIconCls="pl-10"
            error={touched.email && errors.email}
            placeholder="admin@dojuhealth.com"
            className="bg-slate-50 text-slate-900 border-slate-300 focus:border-doju-lime"
          />

          <CustomInput
            name="password"
            label="Password"
            type="password"
            value={values.password}
            onChange={handleChange}
            leftIcon={<Lock className="size-4 text-slate-400" />}
            leftIconCls="pl-10"
            error={touched.password && errors.password}
            placeholder="Enter your password"
            className="bg-slate-50 text-slate-900 border-slate-300 focus:border-doju-lime"
          />

          <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-doju-lime focus:ring-doju-lime"
              />
              Remember me
            </label>
            <button
              type="button"
              className="text-doju-lime hover:text-doju-lime-light transition"
            >
              Forgot password?
            </button>
          </div>

          <Button type="submit" className="w-full" variant="doju-primary">
            Sign in
          </Button>

          <div className="text-center text-xs text-slate-500">
            By signing in, you agree to our{" "}
            <span className="text-doju-lime">Terms of Service</span> and{" "}
            <span className="text-doju-lime">Privacy Policy</span>.
          </div>
        </form>
      </div>
    </div>
  );
}
