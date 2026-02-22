import { CustomInput } from "@/components/ui/input/custom-input";
import { CustomModal } from "@/components/ui/modal";
import { useFormHandler } from "@/hooks/use-form-handler";
import { useState } from "react";
import * as yup from "yup";
import { useGetCategories } from "../../api/use-get-categories";
import { CustomSelect } from "@/components/ui/select/custom-select";
import { CustomTextarea } from "@/components/ui/textarea/custom-textarea";
import { Button } from "@/components/ui/button";
import { useAddProduct } from "../../api/use-add-products";

export const CreateProductModal = ({ children }) => {
  const { data: categories, isPending: isCategoriesLoading } =
    useGetCategories();
  const [open, setOpen] = useState(false);
  const { mutate: addProduct, isPending: isAddingProduct } = useAddProduct();
  const { values, errors, touched, handleSubmit, handleChange, setValues } =
    useFormHandler({
      initialValues: {
        name: "",
        description: "",
        price: 0,
        stock: 0,
        categoryId: "",
        imageUrl: "",
      },
      validationSchema: yup.object({
        name: yup.string().required("Product name is required"),
        description: yup.string().required("Product description is required"),
        price: yup
          .number()
          .required("Price is required")
          .positive("Price must be positive"),
        stock: yup
          .number()
          .required("Stock is required")
          .integer("Stock must be an integer")
          .min(0, "Stock cannot be negative"),
        categoryId: yup.string().required("Category is required"),
        imageUrl: yup.string().url("Must be a valid URL").optional(),
      }),
      onSubmit: () => {
        addProduct(values, {
          onSuccess: () => {
            setOpen(false);
          },
        });
      },
    });
  return (
    <CustomModal
      open={open}
      openChange={setOpen}
      trigger={children}
      title="Create New Product"
      position="right"
    >
      <form action="" className="space-y-4" onSubmit={handleSubmit}>
        <CustomInput
          name="name"
          label="Product name"
          value={values.name}
          onChange={handleChange}
          error={touched.name && errors.name}
        />
        <CustomTextarea
          name="description"
          label="Product description"
          value={values.description}
          onChange={handleChange}
          error={touched.description && errors.description}
        />
        <div className="grid grid-cols-2 gap-5">
          <CustomInput
            name="price"
            label="Price(NGN)"
            type="number"
            value={values.price}
            onChange={handleChange}
            error={touched.price && errors.price}
          />
          <CustomInput
            name="stock"
            label="Stock"
            type="number"
            value={values.stock}
            onChange={handleChange}
            error={touched.stock && errors.stock}
          />
        </div>
        <CustomSelect
          name="categoryId"
          label="Category"
          triggerClassName="w-full"
          placeholder="Select Category"
          value={values.categoryId}
          onValueChange={(value) => setValues({ ...values, categoryId: value })}
          options={categories?.map((category) => ({
            label: category.name,
            value: category.id,
          }))}
          error={touched.categoryId && errors.categoryId}
          disabled={isCategoriesLoading}
        />
        <Button
          isLoading={isAddingProduct}
          type="submit"
          variant="doju-primary"
          className="w-full"
        >
          Submit
        </Button>
      </form>
    </CustomModal>
  );
};
