"use client";

import React, { useState, useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { formSchema } from "@/lib/validation";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createPitch } from "@/lib/actions";

const StartupForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    console.log("🚀 Submitting form...");

    try {
      const formValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        link: formData.get("link") as string,
        pitch,
        priceMin: Number(formData.get("priceMin")),
        priceMax: Number(formData.get("priceMax")),
      };

      console.log("📦 Form values:", formValues);

      await formSchema.parseAsync(formValues);
      console.log("✅ Validation passed");

      const result = await createPitch(prevState, formData, pitch);
      console.log("📤 createPitch result:", result);

      if (result.status === "SUCCESS") {
        toast({
          title: "Success",
          description: "Your service has been created successfully",
        });

        console.log("➡️ Redirecting to:", `/startup/${result._id}`);
        router.push(`/startup/${result._id}`);
      }

      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        console.error("❌ Validation errors:", fieldErrors);

        setErrors(fieldErrors as unknown as Record<string, string>);

        toast({
          title: "Error",
          description: "Please check your inputs and try again",
          variant: "destructive",
        });

        return { ...prevState, error: "Validation failed", status: "ERROR" };
      }

      console.error("🔥 Unexpected error during submission:", error);

      toast({
        title: "Error",
        description: "An unexpected error has occurred",
        variant: "destructive",
      });

      return {
        ...prevState,
        error: "An unexpected error has occurred",
        status: "ERROR",
      };
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "INITIAL",
  });

  return (
    <form action={formAction} className="startup-form">
      <div>
        <label htmlFor="title" className="startup-form_label">Title</label>
        <Input
          id="title"
          name="title"
          className="startup-form_input"
          required
          placeholder="Service"
        />
        {errors.title && <p className="startup-form_error">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="startup-form_label">Description</label>
        <Textarea
          id="description"
          name="description"
          className="startup-form_textarea"
          required
          placeholder="Service Description"
        />
        {errors.description && <p className="startup-form_error">{errors.description}</p>}
      </div>

      <div>
        <label htmlFor="category" className="startup-form_label">Category</label>
        <Input
          id="category"
          name="category"
          className="startup-form_input"
          required
          placeholder="Service (Education, Delivery, Home...)"
        />
        {errors.category && <p className="startup-form_error">{errors.category}</p>}
      </div>

      <div>
        <label className="startup-form_label">Price Range (TL)</label>
        <div className="flex gap-4">
          <Input
            id="priceMin"
            name="priceMin"
            type="number"
            min="0"
            className="startup-form_input"
            placeholder="Min"
          />
          <Input
            id="priceMax"
            name="priceMax"
            type="number"
            min="0"
            className="startup-form_input"
            required
            placeholder="Max"
          />
        </div>
        {(errors.priceMin || errors.priceMax) && (
          <p className="startup-form_error">
            {errors.priceMin || errors.priceMax}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="link" className="startup-form_label">Image URL</label>
        <Input
          id="link"
          name="link"
          className="startup-form_input"
          required
          placeholder="Image URL"
        />
        {errors.link && <p className="startup-form_error">{errors.link}</p>}
      </div>

      <div data-color-mode="light">
        <label htmlFor="pitch" className="startup-form_label">More Details</label>
        <MDEditor
          value={pitch}
          onChange={(value) => setPitch(value as string)}
          id="pitch"
          preview="edit"
          height={300}
          style={{ borderRadius: 20, overflow: "hidden" }}
          textareaProps={{
            placeholder: "Briefly describe the service",
          }}
          previewOptions={{
            disallowedElements: ["style"],
          }}
        />
        {errors.pitch && <p className="startup-form_error">{errors.pitch}</p>}
      </div>

      <Button
        type="submit"
        className="startup-form_btn text-white"
        disabled={isPending}
      >
        {isPending ? "Submitting..." : "Submit"}
        <Send className="size-6 ml-2" />
      </Button>
    </form>
  );
};

export default StartupForm;
