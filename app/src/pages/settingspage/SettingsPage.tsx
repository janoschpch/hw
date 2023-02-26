import { Badge, Button, Card, Checkbox, CheckIcon, Group, SimpleGrid, Tabs, TextInput, Text, List } from "@mantine/core";
import React, { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UserIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import Header from "../../components/dashboard/header/Header";
import { useUser } from "../../hooks/useUser";
import HomeworkEditModal from "../../modals/homework/EditHomeworkModal";
import HomeworkCreateModal from "../../modals/homework/CreateHomeworkModal";
import { showNotification } from "@mantine/notifications";
import { openContextModal } from "@mantine/modals";
import { useForm } from "@mantine/form";
import "./SettingsPage.css";

async function updateUserData(token: string, data: any): Promise<any> {
    const response = await fetch("/api/v1/user/updateUserInfo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function updatePassword(token: string, data: any): Promise<any> {
    const response = await fetch("/api/v1/user/changePassword", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function requestAccountInfo(token: string): Promise<any> {
    const response = await fetch("/api/v1/user/accountInfo", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`
        }
    });
    return response.json();
}

async function requestSessions(token: string): Promise<any> {
    const response = await fetch("/api/v1/user/sessions", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`
        }
    });
    return response.json();
}

async function revokeSession(token: string, id: string): Promise<any> {
    const response = await fetch("/api/v1/user/revokeSession", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`
        },
        body: JSON.stringify({ id })
    });
    return response.json();
}

export default function SettingsPage() {
    const navigate = useNavigate();
    const { user, setUser, token, logout } = useUser();
    const [sessions, setSessions] = useState<any[]>([]);

    const userDataForm = useForm({
        initialValues: {
            name: user.name,
            email: user.email,
        }
    })

    useEffect(() => {
        requestSessions(token as string).then((data) => {
            setSessions(data.data.sessions);
        });
    }, []);

    useEffect(() => {
        userDataForm.setFieldValue("name", user.name);
        userDataForm.setFieldValue("email", user.email);
    }, [user]);

    const changePasswordForm = useForm({
        initialValues: {
            newPassword: "",
            newPasswordConfirm: "",
        }
    })

    async function onSaveUserData(values: { name: string, email: string }) {
        const data = await updateUserData(token as string, values);
        if (data.status === "success") {
            setUser(data.data);
            showNotification({
                title: "Success",
                message: "Your data has been updated",
                color: "green",
            });
        } else {
            showNotification({
                title: "Error",
                message: data.message,
                color: "red",
            });
        }
    }

    async function onSavePassword(values: { newPassword: string, newPasswordConfirm: string }) {
        if (values.newPassword !== values.newPasswordConfirm) {
            showNotification({
                title: "Error",
                message: "The passwords do not match",
                color: "red",
            });
            return;
        }
        const data = await updatePassword(token as string, {
            password: values.newPassword,
        });
        if (data.status === "success") {
            showNotification({
                title: "Success",
                message: "Your password has been updated",
                color: "green",
            });
        } else {
            showNotification({
                title: "Error",
                message: data.message,
                color: "red",
            });
        }
    }

    async function onRequestAccountInfo() {
        const data = await requestAccountInfo(token as string);
        if (data.status === "success") {
            let accountInfo = data.data;

            let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(accountInfo));
            let downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "userData.json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        } else {
            showNotification({
                title: "Error",
                message: data.message,
                color: "red",
            });
        }
    }

    async function logoutSession(id: number) {
        const data = await revokeSession(token as string, id.toString());
        if (data.status === "success") {
            showNotification({
                title: "Success",
                message: "The session has been revoked",
                color: "green",
            });
            setSessions(sessions.filter((session) => session.id !== id));
        } else {
            showNotification({
                title: "Error",
                message: data.message,
                color: "red",
            });
        }
    }

    return (
        <div className="SettingsPage">
            <Header tab="settings"/>

            <div className="SettingsPage-form">

                <Tabs defaultValue={"account"}>
                    <Tabs.List>
                        <Tabs.Tab value="account" icon={<UserIcon />}>Account</Tabs.Tab>
                        <Tabs.Tab value="security" icon={<SecurityIcon />}>Security</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="account">
                        <h1>Account</h1>
                        <form
                            style={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                                gap: "1em",
                            }}
                            onSubmit={userDataForm.onSubmit(onSaveUserData)}
                        >
                            <h2>Settings</h2>
                            <TextInput
                                label="Name"
                                placeholder="Name"
                                description="The name you want to be displayed on your profile"
                                required={true}
                                value={userDataForm.values.name}
                                onChange={(e: any) => userDataForm.setFieldValue("name", e.currentTarget.value)}
                            />
                            <TextInput
                                label="Email"
                                placeholder="Email"
                                description="Your email address (it will not be displayed on your profile)"
                                required={true}
                                value={userDataForm.values.email}
                                onChange={(e: any) => userDataForm.setFieldValue("email", e.currentTarget.value)}
                            />
                            <Group
                                style={{
                                    alignSelf: "flex-end",
                                    marginTop: "2em",
                                    float: "right",
                                }}
                            >
                                <Button size="md" type="submit">
                                    Save
                                </Button>
                            </Group>
                        </form>

                        <form
                            style={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                                gap: "1em",
                            }}
                            onSubmit={changePasswordForm.onSubmit(onSavePassword)}
                        >
                            <h2>Change Password</h2>
                            <TextInput
                                label="New Password"
                                placeholder="New Password"
                                description="The new password you want to use"
                                type={"password"}
                                required={true}
                                value={changePasswordForm.values.newPassword}
                                onChange={(e: any) => changePasswordForm.setFieldValue("newPassword", e.currentTarget.value)}
                            />
                            <TextInput
                                label="Confirm New Password"
                                placeholder="Confirm New Password"
                                description="Confirm your new password"
                                type={"password"}
                                required={true}
                                value={changePasswordForm.values.newPasswordConfirm}
                                onChange={(e: any) => changePasswordForm.setFieldValue("newPasswordConfirm", e.currentTarget.value)}
                            />
                            <Group
                                style={{
                                    alignSelf: "flex-end",
                                    marginTop: "2em",
                                    float: "right",
                                }}
                            >
                                <Button size="md" type="submit" color="red">
                                    Change Password
                                </Button>
                            </Group>
                        </form>

                        <div className="SettingsPage-actions">
                            <Group
                                style={{
                                    marginTop: "2em",
                                    float: "left",
                                }}
                            >
                                <Button size="md" color="blue" onClick={onRequestAccountInfo}>
                                    Export Data
                                </Button>

                                <Button size="md" color="red" variant="outline">
                                    Delete Account
                                </Button>
                            </Group>
                        </div>
                    </Tabs.Panel>

                    <Tabs.Panel value="security">
                        <h1>Sessions</h1>

                        <SimpleGrid cols={2}>
                            {sessions.map((session) => (
                                <Card>
                                    <Group position="apart" mt="md" mb="xs">
                                        <Text weight={500}>{session.agent.device.vendor 
                                            && session.agent.device.model 
                                            ?  session.agent.device.vendor
                                            +  " "
                                            +  session.agent.device.model
                                            : "Unknown Device"
                                        }</Text>
                                        <Badge color={session.active ? "green" : "red"} variant="light">
                                            {session.active ? "Active" : "Inactive"}
                                        </Badge>
                                        <List>
                                            <List.Item>
                                                <Text weight={500}><strong>IP:</strong> {session.ip}</Text>
                                            </List.Item>
                                            <List.Item>
                                                <Text weight={500}><strong>OS:</strong> {session.agent.os.name
                                                    && session.agent.os.version
                                                    ? session.agent.os.name
                                                    + " "
                                                    + session.agent.os.version
                                                    : "Unknown OS"
                                                }</Text>
                                            </List.Item>
                                            <List.Item>
                                                <Text weight={500}><strong>Browser:</strong> {session.agent.browser.name
                                                    && session.agent.browser.version
                                                    ? session.agent.browser.name
                                                    + " "
                                                    + session.agent.browser.version
                                                    : "Unknown Browser"
                                                }</Text>
                                            </List.Item>
                                            <List.Item>
                                                <Text weight={500}><strong>Expires:</strong> {new Date(session.expiresAt).toLocaleDateString()
                                                + " "
                                                + new Date(session.expiresAt).toLocaleTimeString()}</Text>
                                            </List.Item>
                                        </List>
                                        <Button variant="light" color="red" fullWidth mt="md" radius="md" onClick={() => logoutSession(session.id)}>
                                            Logout
                                        </Button>
                                    </Group>
                                </Card>
                            ))}
                        </SimpleGrid>
                    </Tabs.Panel>
                </Tabs>

            </div>
        </div>
    );
}