"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";
import type { Note } from "@/types/note";

interface NoteFormProps {
  onCancel: () => void;
}

export function NoteForm({ onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: Pick<Note, "title" | "content" | "tag">) =>
      createNote(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onCancel();
    },
  });

  return (
    <Formik
      initialValues={{
        title: "",
        content: "",
        tag: "Todo",
      }}
      validationSchema={Yup.object({
        title: Yup.string()
          .min(3, "Мінімум 3 символи")
          .max(50, "Максимум 50 символів")
          .required("Обов’язкове поле"),
        content: Yup.string().max(500, "Максимум 500 символів").optional(),
        tag: Yup.string()
          .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
          .required("Обов’язкове поле"),
      })}
      onSubmit={(values) => mutation.mutate(values)}
    >
      <Form className="flex flex-col gap-3">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Заголовок
          </label>
          <Field
            id="title"
            name="title"
            placeholder="Введіть назву нотатки"
            className="border border-gray-300 rounded w-full p-2"
          />
          <ErrorMessage
            name="title"
            component="div"
            className="text-red-500 text-sm mt-1"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1">
            Зміст
          </label>
          <Field
            as="textarea"
            id="content"
            name="content"
            placeholder="Додайте опис"
            className="border border-gray-300 rounded w-full p-2 h-24"
          />
          <ErrorMessage
            name="content"
            component="div"
            className="text-red-500 text-sm mt-1"
          />
        </div>

        <div>
          <label htmlFor="tag" className="block text-sm font-medium mb-1">
            Тег
          </label>
          <Field
            as="select"
            id="tag"
            name="tag"
            className="border border-gray-300 rounded w-full p-2"
          >
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage
            name="tag"
            component="div"
            className="text-red-500 text-sm mt-1"
          />
        </div>

        <div className="flex justify-end gap-3 mt-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100"
          >
            Скасувати
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Створити
          </button>
        </div>
      </Form>
    </Formik>
  );
}
