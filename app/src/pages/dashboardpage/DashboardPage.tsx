import { Checkbox } from "@mantine/core";
import React, { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import Header from "../../components/dashboard/header/Header";
import { useUser } from "../../hooks/useUser";
import "./DashboardPage.css";
import HomeworkEditModal from "../../modals/homework/EditHomeworkModal";
import HomeworkCreateModal from "../../modals/homework/CreateHomeworkModal";
import { showNotification } from "@mantine/notifications";
import HomeworkShareModal from "../../modals/homework/ShareHomeworkModal";

async function getUserHomework(page: number, token: string): Promise<any> {
    const response = await fetch("/api/v1/homework/list?page=" + page, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`
        }
    });

    let data = await response.json();
    return data.data;
}

async function updateHomework(token: string, data: any): Promise<any> {
    const response = await fetch("/api/v1/homework/update", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function createHomework(token: string, data: any): Promise<any> {
    const response = await fetch("/api/v1/homework/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function deleteHomework(token: string, id: number): Promise<any> {
    const response = await fetch("/api/v1/homework/delete", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`
        },
        body: JSON.stringify({ id })
    });
    return response.json();
}

async function shareState(token: string, id: number): Promise<any> {
    const response = await fetch("/api/v1/homework/shareState", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`
        },
        body: JSON.stringify({ id })
    });
    return response.json();
}

export default function DashboardPage() {
    const navigate = useNavigate();
    const { user, token, logout } = useUser();

    const [homework, setHomework] = useState<any[]>([]);
    const [editHomework, setEditHomework] = useState<any | null>(null);
    const [editOpen, setEditOpen] = useState(false);

    const [createOpen, setCreateOpen] = useState(false);

    const [shareOpen, setShareOpen] = useState(false);
    const [shareShared, setShareShared] = useState(false);
    const [shareHomework, setShareHomework] = useState<any | null>(null);
    const [shareUrl, setShareUrl] = useState("");

    useEffect(() => {
        getUserHomework(0, token as string).then((data) => {
            setHomework(data.data);
        });
    }, []);

    const onShareClick = async (id: number) => {
        const response = await shareState(token as string, id);
        if (response.status === "success") {
            setShareHomework(id);
            setShareUrl(response.data.accessUrl);
            setShareShared(response.data.shared);
            setShareOpen(true);
        } else {
            showNotification({
                title: "Error",
                message: response.message,
                color: "red",
            });
        }
    }

    return (
        <div className="DashboardPage">
            <Header tab="home"/>

            <HomeworkEditModal 
                opened={editOpen}
                homework={editHomework}
                onClose={() => {
                    setEditOpen(false);
                    setEditHomework(null);
                }}
                onSave={(data) => {
                    updateHomework(token as string, {
                        id: editHomework.id,
                        ...data
                    });
                    setHomework(homework.map((hw) => {
                        if (hw.id === editHomework.id) {
                            return {
                                ...hw,
                                ...data
                            }
                        }
                        return hw;
                    }));
                }}
            />

            <HomeworkCreateModal
                opened={createOpen}
                onClose={() => {
                    setCreateOpen(false);
                }}
                onSave={(data) => {
                    createHomework(token as string, data)
                    .then((data) => {
                        setHomework([...homework, data.data]);
                    });
                }}
            />

            <HomeworkShareModal 
                opened={shareOpen}
                homework={shareHomework}
                accessUrl={shareUrl}
                shared={shareShared}
                onClose={() => {
                    setShareOpen(false);
                    setShareHomework(null);
                }}
            />

            <div className="homework-container">
                {homework.length > 0 ? (
                    <h1>Hausaufgaben</h1>
                ) : (
                    <h2>Keine Hausaufgaben zu erledigen</h2>
                )}

                <div className="homework-list">
                    {
                        homework.map((item) => {
                            return (
                                <div className="homework-card">
                                <header>
                                    <span>
                                        <strong>{item.subject}</strong>
                                    </span>
                                    <Checkbox size="lg" color="green" checked={item.done} onChange={(event) => {
                                        item.done = event.target.checked;
                                        setHomework([...homework]);
                                        updateHomework(token as string, item);
                                    }} styles={{ input: { background: "transparent", cursor: "pointer" } }}/>
                                </header>
                                <main>
                                    <span>{item.description}</span>
                                </main>
                                <footer>
                                    <span>
                                        {new Date(item.created).toUTCString()}
                                    </span>
                                    <div className="homework-card-icons">
                                        <button onClick={() => onShareClick(item.id)}>
                                            <ShareIcon style={{color: "white", cursor: "pointer"}} />
                                        </button>
                                        <button onClick={() => {
                                            setEditHomework(item);
                                            setEditOpen(true);
                                        }}>
                                            <EditIcon style={{color: "white", cursor: "pointer"}} />
                                        </button>
                                        <button onClick={() => {
                                            deleteHomework(token as string, item.id).then(() => {
                                                setHomework(homework.filter((hw) => hw.id != item.id));
                                            });
                                        }}>
                                            <DeleteIcon style={{color: "white", cursor: "pointer"}} />
                                        </button>
                                    </div>
                                </footer>
                            </div>
                            )
                        })
                    }
                </div>
            </div>

            <div className="actions">
                <button className="create-homework" onClick={() => {
                    setCreateOpen(true);
                }}>
                    <AddIcon />
                </button>
            </div>
        </div>
    );
}