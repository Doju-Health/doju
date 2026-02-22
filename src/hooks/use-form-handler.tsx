import { useFormik, FormikConfig, FormikValues } from "formik";

interface UseFormHandlerProps<Values> extends FormikConfig<Values> {}

export const useFormHandler = <Values extends FormikValues>({
  initialValues,
  validationSchema,
  onSubmit,
  ...rest
}: UseFormHandlerProps<Values>) => {
  return useFormik<Values>({
    initialValues,
    validationSchema,
    onSubmit,
    ...rest,
  });
};
