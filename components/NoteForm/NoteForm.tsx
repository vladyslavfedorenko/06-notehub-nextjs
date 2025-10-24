"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";

interface NoteFormProps {
  onSuccess?: () => void;
}

export const NoteForm: React.FC<NoteFormProps> = ({ onSuccess }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onSuccess?.();
    },
  });

  return (
    <Formik
      initialValues={{ title: "", content: "", tag: "Todo" }}
      validationSchema={Yup.object({
        title: Yup.string().min(3).max(50).required("Title is required"),
        content: Yup.string().optional(),
        tag: Yup.string().oneOf([
          "Todo",
          "Work",
          "Personal",
          "Meeting",
          "Shopping",
        ]),
      })}
      onSubmit={(values, { resetForm }) => {
        mutation.mutate(values);
        resetForm();
      }}
    >
      {({ isSubmitting }) => (
        <Form className="flex flex-col gap-3 p-4 w-80">
          <div>
            <label className="block mb-1">Title</label>
            <Field name="title" className="border p-2 rounded w-full" />
            <ErrorMessage
              name="title"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <label className="block mb-1">Content</label>
            <Field
              as="textarea"
              name="content"
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block mb-1">Tag</label>
            <Field as="select" name="tag" className="border p-2 rounded w-full">
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-500 text-white rounded py-2 mt-2 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Create"}
          </button>
        </Form>
      )}
    </Formik>
  );
};
