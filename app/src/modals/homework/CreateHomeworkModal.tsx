import { useEffect, useState } from "react";

import { Button, Checkbox, Group, Modal, TextInput } from "@mantine/core";

import { useForm } from "@mantine/form";
import { useUser } from "../../hooks/useUser";

const HomeworkCreateModal = (props: {
  opened: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
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
    form.setValues({
        subject: form.values.subject,
        description: form.values.description,
        done: form.values.done
      });
    // @ts-ignore: to prevent endless recursion
  }, [props.homework]);

  const onHomeworkCreate = (values: { subject: string, description: string, done: boolean}) => {
    props.onSave({
        ...values
    });
    form.setValues({
        subject: "",
        description: "",
        done: false
    });
    props.onClose();
  }

  return (
    <Modal
      opened={props.opened}
      onClose={props.onClose}
      title="Hausaufgabe erstellen"
    >
        <form
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "1em",
          }}
          onSubmit={form.onSubmit(onHomeworkCreate)}
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
              Hinzufügen
            </Button>
          </Group>
        </form>
    </Modal>
  );
};

export default HomeworkCreateModal;
