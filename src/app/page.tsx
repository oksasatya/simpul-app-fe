"use client";

import React, {useEffect, useRef, useState} from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    fetchMessages,
    selectUser,
    sendMessage,
    fetchChatUsers,
    findOrCreateRoom,
    selectRoom,
} from "@/store/slice/chatSlice";

const CURRENT_USER = {
    id: 1,
    username: "andi",
};

const getAvatarUrl = (username: string) => {
    const hash = Array.from(username).reduce(
        (acc, char) => acc + char.charCodeAt(0),
        0
    );
    const avatarId = (hash % 70) + 1; // pravatar range 1-70
    return `https://i.pravatar.cc/150?img=${avatarId}`;
};

export default function HomePage() {
    const dispatch = useAppDispatch();
    const { selectedUser, selectedRoom, messages, chatUsers } = useAppSelector(
        (state) => state.chat
    );
    const [input, setInput] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        dispatch(fetchChatUsers(CURRENT_USER.id));
    }, [dispatch]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !selectedRoom) return;

        dispatch(sendMessage({
            content: input,
            roomId: selectedRoom.id,
            userId: CURRENT_USER.id,
        }));
        setInput("");
    };

    return (
        <div className="h-screen flex">
            {/* Sidebar */}
            <aside className="w-[30%] max-w-sm border-r bg-gray-900 text-white flex flex-col">
                <div className="p-4 text-lg font-semibold">Simpul App Chat</div>

                <div className="flex-1 overflow-y-auto">
                    {chatUsers.map((user) => (
                        <button
                            key={user.id}
                            onClick={async () => {
                                const room = await dispatch(findOrCreateRoom([CURRENT_USER.id, user.id])).unwrap();
                                dispatch(selectUser(user));
                                dispatch(selectRoom(room));
                                dispatch(fetchMessages(room.id));
                            }}
                            className={`flex items-center gap-3 p-3 w-full text-left hover:bg-gray-800 ${
                                selectedUser?.id === user.id ? "bg-gray-800" : ""
                            }`}
                        >
                            <img
                                src={getAvatarUrl(user.username)}
                                alt={user.username}
                                className="w-8 h-8 rounded-full"
                            />
                            <div className="flex-1">
                                <p className="font-semibold">{user.username}</p>
                                <p className="text-sm text-gray-400 truncate">
                                    {user.last_message?.content || "Belum ada pesan"}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </aside>

            {/* Chat Room */}
            <main className="flex-1 flex flex-col bg-gray-50">
                <div className="p-4 border-b bg-white text-black shadow h-[64px] flex items-center">
                    <p className="font-semibold">
                        {selectedUser ? selectedUser.username : "Pilih room"}
                    </p>
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-2">
                    {selectedUser ? (
                        <>
                            {messages.map((msg) => {
                                const isMe = msg.user === CURRENT_USER.username;
                                return (
                                    <div
                                        key={msg.id}
                                        className={`max-w-[70%] px-4 py-2 rounded-lg ${
                                            isMe
                                                ? "bg-blue-600 text-white self-end ml-auto"
                                                : "bg-gray-200 text-black"
                                        }`}
                                    >
                                        {!isMe && (
                                            <div className="flex items-center gap-2 mb-1">
                                                <img
                                                    src={getAvatarUrl(msg.user)}
                                                    alt={msg.user}
                                                    className="w-6 h-6 rounded-full"
                                                />
                                                <span className="text-sm font-semibold">{msg.user}</span>
                                            </div>
                                        )}
                                        <div>{msg.content}</div>
                                        <div className={`text-right text-xs ${
                                            isMe
                                                ? "text-white"
                                                : "text-black"
                                        }`}>{new Date(msg.time).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}</div>
                                    </div>
                                );
                            })}
                            <div ref={bottomRef} />
                        </>
                    ) : (
                        <div className="text-center text-gray-400 mt-20">
                            Pilih room untuk memulai percakapan
                        </div>
                    )}
                </div>

                {selectedUser && (
                    <form
                        onSubmit={handleSubmit}
                        className="p-4 border-t bg-white flex items-center gap-2"
                    >
                        <input
                            type="text"
                            placeholder="Ketik pesan..."
                            className="flex-1 text-black px-4 py-2 border rounded-lg focus:outline-none"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                        >
                            Kirim
                        </button>
                    </form>
                )}
            </main>
        </div>
    );
}