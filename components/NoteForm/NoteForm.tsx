"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";
import type { Note } from "@/types/note";
import styles from "./NoteForm.module.css";

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
        content: Yup.string().max(500, "Максимум 500 символів"),
        tag: Yup.string()
          .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
          .required("Обов’язкове поле"),
      })}
      onSubmit={(values) => mutation.mutate(values)}
    >
      <Form className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="title" className={styles.label}>
            Заголовок
          </label>
          <Field
            id="title"
            name="title"
            placeholder="Введіть назву нотатки"
            className={styles.input}
          />
          <ErrorMessage name="title" component="div" className={styles.error} />
        </div>

        <div className={styles.field}>
          <label htmlFor="content" className={styles.label}>
            Зміст
          </label>
          <Field
            as="textarea"
            id="content"
            name="content"
            placeholder="Додайте опис"
            className={styles.textarea}
          />
          <ErrorMessage
            name="content"
            component="div"
            className={styles.error}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="tag" className={styles.label}>
            Тег
          </label>
          <Field as="select" id="tag" name="tag" className={styles.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="div" className={styles.error} />
        </div>

        <div className={styles.buttons}>
          <button type="button" onClick={onCancel} className={styles.cancelBtn}>
            Скасувати
          </button>
          <button type="submit" className={styles.submitBtn}>
            Створити
          </button>
        </div>
      </Form>
    </Formik>
  );
}
