'use client'
import React, { useEffect, useState } from "react";
import "./index.css";
import { Note } from "@/app/domain/models/Note";
import { findNotes, setupPowerSync, updateNote, watchLists } from "@/app/service/powersync";
import ProfileClient from "../Profile";


export default function NoteSync() {
    const [data, setData] = useState<Note[] | null>(null);

    useEffect(() => {
        const initPowerSync = async () => {
            const response = await fetch('/api/auth/token'); // Adjust the path if needed
            if (!response.ok) {
                throw new Error(`Failed to fetch access token: ${response.statusText}`);
            }
            const data = await response.json();
            const accessToken = data.foo;
            await setupPowerSync(accessToken);

            const notes = await findNotes();
            console.log("Notes:", notes);
            setData(notes);
        };

        initPowerSync();

        watchLists((update) => {
            console.log("Received update:", update);
            setData(update);
        }).catch((err) => {
            console.error("Error watching lists:", err);
        });

    }, []);

    // Function to handle updates when the note is edited
    const handleNoteChange = (id: string, newContent: string) => {
        console.log(`Note changed for user ${id}:`, newContent); // Log the change
        setData((prevData) => {
            if (prevData) {
                return prevData.map((note) =>
                    note.id === id ? { ...note, content: newContent } : note
                );
            }
            return prevData;
        });
    };

    const handleUpdate = () => {
        if (data) {
            console.log("Updating notes:", data);
            data.forEach(({ id, content }) => {
                if (id && content) {
                    updateNote(content, id).catch((err) =>
                        console.error(`Error updating note for user ${id}:`, err)
                    );
                } else {
                    console.warn(`Missing id or note for update:`, { id, note: content });
                }
            });
        } else {
            console.warn("No data to update.");
        }
    };

    return (
        <div className="customer-list">
            <div>
                <ProfileClient />
            </div>
            <div>
                {data && data.length > 0 ? (
                    <ul>
                        {data.map((item) => (
                            <li key={item.id} className="list-item">
                                <div className="info-card">
                                    <div className="info-item">
                                        <strong>ID:</strong> {item.id}
                                    </div>
                                </div>
                                <textarea
                                    className="item-note"
                                    value={item.content || ""}
                                    onChange={(e) =>
                                        handleNoteChange(item.id, e.target.value)
                                    }
                                    placeholder="Write a note..."
                                />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <span>No data available</span>
                )}
                <button onClick={handleUpdate} className="update-button">
                    Update Notes
                </button>
            </div>

        </div>
    );
}