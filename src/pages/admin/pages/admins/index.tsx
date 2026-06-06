import { useState } from "react";
import * as yup from "yup";
import { CustomModal } from "@/components/ui/modal";
import { CustomInput } from "@/components/ui/input/custom-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, UserPlus, Mail, CheckCircle2 } from "lucide-react";
import { useFormHandler } from "@/hooks/use-form-handler";
import { useInviteAdmin } from "../../api/use-invite-admin";

export default function AdminsPage() {
  const [open, setOpen] = useState(false);
  const { mutate: inviteAdmin, isPending } = useInviteAdmin();

  const { values, errors, touched, handleChange, handleSubmit, resetForm } =
    useFormHandler({
      initialValues: { fullName: "", email: "" },
      validationSchema: yup.object({
        fullName: yup.string().required("Full name is required"),
        email: yup
          .string()
          .email("Please enter a valid email address")
          .required("Email is required"),
      }),
      onSubmit: (vals) => {
        inviteAdmin(
          { fullName: vals.fullName, email: vals.email },
          {
            onSuccess: () => {
              resetForm();
              setOpen(false);
            },
          },
        );
      },
    });

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) resetForm();
    setOpen(isOpen);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Management</h1>
          <p className="text-muted-foreground">
            Invite new administrators to manage the DOJU platform.
          </p>
        </div>

        <CustomModal
          open={open}
          openChange={handleClose}
          title="Invite a new admin"
          position="right"
          description="The invited user will receive an email with instructions to set up their admin account."
          trigger={
            <Button variant="doju-primary" className="gap-2 w-full sm:w-auto">
              <UserPlus className="size-4" />
              Invite Admin
            </Button>
          }
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <CustomInput
              name="fullName"
              label="Full name"
              placeholder="e.g. Jane Doe"
              value={values.fullName}
              onChange={handleChange}
              error={touched.fullName && errors.fullName}
            />
            <CustomInput
              name="email"
              label="Email address"
              type="email"
              placeholder="admin@dojuhealth.com"
              value={values.email}
              onChange={handleChange}
              error={touched.email && errors.email}
            />
            <Button
              type="submit"
              variant="doju-primary"
              className="w-full"
              isLoading={isPending}
            >
              Send invitation
            </Button>
          </form>
        </CustomModal>
      </div>

      {/* Info cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-dashed">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Shield className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-base">Admin privileges</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm">
              Admins have full access to manage users, products, transactions,
              and platform settings.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <Mail className="size-5 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-base">Email invitation</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm">
              An invitation email is sent to the new admin with a secure link to
              complete their account setup.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="border-dashed sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                <CheckCircle2 className="size-5 text-amber-600 dark:text-amber-400" />
              </div>
              <CardTitle className="text-base">Instant access</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm">
              Once the invited admin completes setup, they gain immediate access
              to the admin dashboard.
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* CTA banner */}
      <Card className="bg-muted/40">
        <CardContent className="flex flex-col items-center gap-4 py-10 text-center sm:flex-row sm:text-left sm:py-8 sm:px-8">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <UserPlus className="size-7 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">Ready to add a new admin?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Click the button to send an invitation. The new admin will receive
              an email to set up their account.
            </p>
          </div>
          <Button
            variant="doju-primary"
            size="lg"
            className="gap-2 shrink-0"
            onClick={() => setOpen(true)}
          >
            <UserPlus className="size-4" />
            Invite Admin
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
