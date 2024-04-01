import { useForm } from "react-hook-form";
import styled, { css } from "styled-components";
import FormRowProvider from "./FormRowProvider";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

const Input = styled.input`
  border: 1px solid var(--color-grey-500);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);
  padding: 0.8rem 1.2rem;
`;

const Form = styled.form`
  ${(props) =>
    props.type === "regular" &&
    css`
      padding: 2.4rem 4rem;

      background-color: var(--color-grey-0);
      border: 1px solid var(--color-grey-100);
      border-radius: var(--border-radius-md);
    `}

  ${(props) =>
    props.type === "modal" &&
    css`
      width: 80rem;
    `}
    
  overflow: hidden;
  font-size: 1.4rem;
`;

Form.defaultProps = {
  type: "regular",
};

const Textarea = styled.textarea`
  padding: 0.8rem 1.2rem;
  border: 1px solid var(--color-grey-300);
  border-radius: 5px;
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-sm);
  width: 100%;
  height: 8rem;
`;

const Button = styled.button`
  border: 0;
  outline: none;
  border-radius: 15px;
  padding: 15px 0;
  font-size: 20px;
  font-weight: 400;
  letter-spacing: 0.1em;
  background: #01939c;
  color: var(--color-grey-800);
  cursor: pointer;
  transition: all 0.5s ease;
  width: 30%;
  margin: 10px 0;
  &:hover,
  &:focus {
    background: #025c61;
  }
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  border-radius: 1rem;
`;

function AddProductForm({ providerUsername }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const queryClient = useQueryClient();

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const onSubmit = async (data) => {
    let base64Image = "";
    if (data.image && data.image.length > 0) {
      base64Image = await toBase64(data.image[0]);
    }

    const product = {
      product_id: "test",
      price: data.price,
      currency: data.currency,
      weight: data.weight,
      name: data.name,
      brand: data.brand,
      quantity: data.quantity,
      prices_availability: "in stock",
      prices_condition: "new",
      prices_merchant: providerUsername,
      prices_sourceURLs: "null",
      categories: data.categories,
      dateAdded: new Date().toISOString(),
      dateUpdated: new Date().toISOString(),
      imageURLs: base64Image,
      sourceURLs: "null",
      rating: 0,
      nr_rating: 0,
      description: data.description,
    };

    try {
      const response = await fetch("http://127.0.0.1:8005/add_new_product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      console.log("Success:", responseData);
      toast.success("Product added successfully!");
      queryClient.invalidateQueries("providersConfirmations");
      reset();
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("An error occurred while adding the product!");
    }
  };

  return (
    <StyledContainer>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormRowProvider label="Name" error={errors.name}>
          <Input {...register("name", { required: true })} placeholder="Name" />
        </FormRowProvider>

        <FormRowProvider label="Price" error={errors.price}>
          <Input
            type="number"
            {...register("price", { required: true })}
            placeholder="Price"
          />
        </FormRowProvider>

        <FormRowProvider label="Currency" error={errors.currency}>
          <Input
            type="TEXT"
            {...register("currency", { required: true })}
            placeholder="Currency"
          />
        </FormRowProvider>

        <FormRowProvider label="Categories" error={errors.categories}>
          <Input
            type="text"
            {...register("categories", { required: true })}
            placeholder="Categories"
          />
        </FormRowProvider>

        <FormRowProvider label="Brand" error={errors.brand}>
          <Input
            type="text"
            {...register("brand", { required: true })}
            placeholder="Brand"
          />
        </FormRowProvider>

        <FormRowProvider label="Weight" error={errors.weight}>
          <Input
            type="text"
            {...register("weight", { required: true })}
            placeholder="Weight"
          />
        </FormRowProvider>

        <FormRowProvider label="Quantity" error={errors.quantity}>
          <Input
            type="number"
            {...register("quantity", { required: true })}
            placeholder="Quantity"
          />
        </FormRowProvider>

        <FormRowProvider label="File" error={errors.file}>
          <Input type="file" {...register("image", { required: true })} />
        </FormRowProvider>

        <FormRowProvider label="Description" error={errors.description}>
          <Textarea
            {...register("description", { required: true })}
            placeholder="Description"
          />
        </FormRowProvider>

        <Button type="submit">Submit</Button>
      </Form>
    </StyledContainer>
  );
}

export default AddProductForm;
