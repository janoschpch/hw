import { useEffect, useState } from "react";

import { Button, Checkbox, CopyButton, Group, Modal, TextInput } from "@mantine/core";
import CopyIcon from "@mui/icons-material/ContentCopy";

import { useForm } from "@mantine/form";
import { useUser } from "../../hooks/useUser";

async function shareHomework(token: string, id: number, shared: boolean): Promise<any> {
    const response = await fetch("/api/v1/homework/share", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`
        },
        body: JSON.stringify({ id, shared })
    });
    return response.json();
}

const HomeworkShareModal = (props: {
  opened: boolean;
  accessUrl: string;
  shared: boolean;
  homework: number;
  onClose: () => void;
}) => {
  const user = useUser();

  const shareState = async (state: boolean) => {
    const data = await shareHomework(user.token as string, props.homework, state);
  }

  return (
    <Modal
      opened={props.opened}
      onClose={props.onClose}
      title="Share Homework"
    >
        <TextInput
            disabled={true}
            value={props.accessUrl}
            label="Access URL"
            rightSection={
                <CopyButton value={props.accessUrl}> 
                    {({ copied, copy }) => (
                        <CopyIcon onClick={copy} style={{cursor: "pointer"}}/>
                    )}
                </CopyButton>
            }
        />
        <br />
        <Checkbox defaultChecked={props.shared} onChange={(e) => shareState(e.target.checked)} label="Shared" />
    </Modal>
  );
};

export default HomeworkShareModal;
