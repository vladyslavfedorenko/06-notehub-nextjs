"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";
import type { Note } from "@/types/note";

interface NoteFormProps {
  onSubmit?: (note: Pick<Note, "title" | "content" | "tag">) => void;
  onCancel?: () => void;
}

/**
 * Компонент форми створення нотатки.
 * Використовує Formik + Yup для валідації.
 * Інтегрований з React Query для мутацій та інвалідації кешу.
 */
export function NoteForm({ onSubmit, onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: Pick<Note, "title" | "content" | "tag">) =>
      createNote(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] as const });
      onCancel?.();
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
        onSubmit?.(values);
        resetForm();
      }}
    >
      <Form className="flex flex-col gap-3">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="title">
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
          <label className="block text-sm font-medium mb-1" htmlFor="content">
            Зміст (необов’язково)
          </label>
          <Field
            as="textarea"
            id="content"
            name="content"
            placeholder="Додайте опис"
            className="border border-gray-300 rounded w-full p-2 h-24"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="tag">
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
