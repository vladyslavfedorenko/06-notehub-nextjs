"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export interface NoteFormProps {
  onSubmit: (title: string, content: string, tag: string) => void;
  onCancel?: () => void;
}

interface FormValues {
  title: string;
  content: string;
  tag: string;
}

const NoteForm = ({ onSubmit, onCancel }: NoteFormProps) => {
  const initialValues: FormValues = { title: "", content: "", tag: "" };

  const validationSchema = Yup.object({
    title: Yup.string()
      .required("Title is required")
      .max(100, "Max 100 characters"),
    content: Yup.string()
      .required("Content is required")
      .max(500, "Max 500 characters"),
    tag: Yup.string().required("Tag is required"),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        onSubmit(values.title, values.content, values.tag);
        resetForm();
      }}
    >
      {({ isSubmitting }) => (
        <Form className="flex flex-col gap-3 border rounded p-4 bg-gray-50">
          <div>
            <label className="font-semibold">Title</label>
            <Field
              name="title"
              placeholder="Enter title"
              className="border p-2 w-full rounded"
            />
            <ErrorMessage
              name="title"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <label className="font-semibold">Content</label>
            <Field
              as="textarea"
              name="content"
              placeholder="Enter content"
              className="border p-2 w-full rounded h-24"
            />
            <ErrorMessage
              name="content"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <label className="font-semibold">Tag</label>
            <Field
              name="tag"
              placeholder="Enter tag"
              className="border p-2 w-full rounded"
            />
            <ErrorMessage
              name="tag"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div className="flex gap-3 mt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Note
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="border px-4 py-2 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NoteForm;
