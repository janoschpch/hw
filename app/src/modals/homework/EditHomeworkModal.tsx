import { useEffect, useState } from "react";

import { Button, Checkbox, Group, Modal, MultiSelect, TextInput } from "@mantine/core";

import { useForm } from "@mantine/form";
import axios from "axios";
import { showNotification } from "@mantine/notifications";
import { useUser } from "../../hooks/useUser";

const HomeworkEditModal = (props: {
  opened: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  homework: any;
}) => {
  const user = useUser();

  const form = useForm({
    initialValues: {
      subject: "",
      description: "",
      done: false
    }
  });

  useEffect(() => {
    if (props.homework) {
      form.setValues({
        subject: props.homework.subject,
        description: props.homework.description,
        done: props.homework.done
      });
    }
    // @ts-ignore: to prevent endless recursion
  }, [props.homework]);

  const onHomeworkEdit = (values: { subject: string, description: string, done: boolean}) => {
    props.onSave({
        ...values
    });
    props.onClose();
  }

  return (
    <Modal
      opened={props.opened}
      onClose={props.onClose}
      title="Nutzer bearbeiten"
    >
      {props.homework ? (
        <form
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "1em",
          }}
          onSubmit={form.onSubmit(onHomeworkEdit)}
        >
          <TextInput
            required={true}
            label="Subject"
            description="Subject of the homework"
            placeholder="Maths"
            {...form.getInputProps("subject")}
          />
          <TextInput
            required={true}
            label="Description"
            description="Description of the homework"
            placeholder="Book page 42 to 45"
            {...form.getInputProps("description")}
          />
          <Checkbox
            label="Done"
            description="Is the homework done?"
            checked={form.values.done}
            onChange={(event) => {
                form.setFieldValue("done", event.target.checked);
            }}
            {...form.getInputProps("done")}
          />
          <Group
            style={{
              alignSelf: "flex-end",
              marginTop: "2em",
            }}
          >
            <Button size="md" type="submit">
              Speichern
            </Button>
          </Group>
        </form>
      ) : null}
    </Modal>
  );
};

export default HomeworkEditModal;
