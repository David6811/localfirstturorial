'use client'
import React, { useEffect, useState } from "react";
import "./index.css";
import { Note } from "@/app/domain/models/Note";
import { findNotes, setupPowerSync } from "@/app/service/powersync";


export default function NoteSync() {
    const [data, setData] = useState<Note[] | null>(null);

    useEffect(() => {
        const initPowerSync = async () => {
            await setupPowerSync();

            const notes = await findNotes();
            console.log("Notes:", notes);
            setData(notes);
        };

        initPowerSync();

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

    return (
        <div>
            <div className="customer-list">
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
            </div>

        </div>
    );
}