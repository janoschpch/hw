import { Badge, Button, Checkbox, CheckIcon, Group, Pagination, Table, Tabs, TextInput } from "@mantine/core";
import React, { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Header from "../../components/dashboard/header/Header";
import { useUser } from "../../hooks/useUser";
import HomeworkEditModal from "../../modals/homework/EditHomeworkModal";
import HomeworkCreateModal from "../../modals/homework/CreateHomeworkModal";
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { showNotification } from "@mantine/notifications";
import { openContextModal } from "@mantine/modals";
import { useForm } from "@mantine/form";
import "./AdminPage.css";

async function getUsers(token: string, page: number): Promise<any> {
    const response = await fetch("/api/v1/admin/listUsers?page=" + page, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`
        }
    });
    return response.json();
}

export default function AdminPage() {
    const navigate = useNavigate();
    const { user, setUser, token, logout } = useUser();
    const [users, setUsers] = useState<any[]>([]);
    const [userPage, setUserPage] = useState(0);
    const [userPageCount, setUserPageCount] = useState(0);

    useEffect(() => {
        getUsers(token as string, userPage).then((data) => {
            setUsers(data.data.data);
            setUserPageCount(data.data.pages);
        });
    }, [userPage]);

    return (
        <div className="AdminPage">
            <Header tab="admin"/>

            <div className="AdminPage-content">
                <Tabs defaultValue={"general"}>
                    <Tabs.List>
                        <Tabs.Tab value="general" icon={<SettingsIcon />}>General</Tabs.Tab>
                        <Tabs.Tab value="users" icon={<PeopleIcon />}>Users</Tabs.Tab>
                        <Tabs.Tab value="insights" icon={<ShowChartIcon />}>Insights</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="general">
                        <h1>General</h1>
                    </Tabs.Panel>

                    <Tabs.Panel value="users">
                        <Group style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>
                            <h1>Users</h1>
                            <Button variant="outline" color="blue" size="sm">
                                <AddIcon />
                            </Button>
                        </Group>
                        <Table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th style={{
                                        float: "right"
                                    }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users && users.map((user) => (
                                    <tr>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td><Badge>{user.role}</Badge></td>
                                        <td style={{
                                            float: "right"
                                        }}>
                                           <Group>
                                            <Button variant="outline" color="red" size="sm">
                                                    <DeleteIcon />
                                                </Button>
                                                
                                                <Button variant="outline" color="blue" size="sm">
                                                    <EditIcon />
                                                </Button>
                                            </Group> 
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <Pagination page={userPage + 1} total={userPageCount} onChange={(e) => {
                            setUserPage(e - 1);
                        }} />
                    </Tabs.Panel>

                    <Tabs.Panel value="insights">
                        <h1>Insights</h1>
                    </Tabs.Panel>
                </Tabs>
            </div>
        </div>
    );
}