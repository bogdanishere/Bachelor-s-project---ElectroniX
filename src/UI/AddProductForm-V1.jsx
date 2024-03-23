import React from "react";
import { useForm } from "react-hook-form";
import styled, { css } from "styled-components";
import FormRowProvider from "./FormRowProvider";
import { useMutation } from "@tanstack/react-query";

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

function AddProductForm({ providerUsername }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // const onSubmit = async (data) => {
  //   const productCreated = new Date().toISOString();

  //   const product = {
  //     product_id: "test",
  //     price: data.price,
  //     currency: data.currency,
  //     weight: data.weight,
  //     name: data.name,
  //     brand: data.brand,
  //     quantity: data.quantity,
  //     prices_availability: "in stock",
  //     prices_condition: "new",
  //     prices_merchant: providerUsername,
  //     prices_sourceURLs: "",
  //     categories: data.categories,
  //     dateAdded: productCreated,
  //     dateUpdated: productCreated,
  //     imageURLs: data.image && data.image.length > 0 ? data.image[0] : "",
  //     sourceURLs: "",
  //     rating: 0,
  //     nr_rating: 0,
  //     description: data.description,
  //   };

  //   console.log(product);

  //   if (data.image && data.image.length > 0) {
  //     console.log("Image File Details:", data.image[0]);
  //   }

  //   try {
  //     const response = await fetch(
  //       "http://192.168.0.203:8005/add_new_product",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(product),
  //       }
  //     );
  //     const data2 = await response.json();
  //     console.log("Success:", data2);
  //   } catch (error) {
  //     console.error("Error adding product:", error);
  //   }

  //   // reset();
  // };

  const onSubmit = async (data) => {
    const productCreated = new Date().toISOString();

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
      prices_sourceURLs: "",
      categories: data.categories,
      dateAdded: productCreated,
      dateUpdated: productCreated,
      imageURLs: data.image && data.image.length > 0 ? data.image[0] : "",
      sourceURLs: "",
      rating: 0,
      nr_rating: 0,
      description: data.description,
    };

    console.log(product);

    if (data.image && data.image.length > 0) {
      console.log("Image File Details:", data.image[0]);
    }

    try {
      const response = await fetch(
        "http://192.168.0.203:8005/add_new_product",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
        }
      );
      const data2 = await response.json();
      console.log("Success:", data2);
    } catch (error) {
      console.error("Error adding product:", error);
    }

    // reset();
  };

  return (
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
  );
}

export default AddProductForm;
