import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {API} from "@/constant/api";



export type Room = {id: number, name: string};
export type Message = {
    id: number;
    user: string;
    content: string;
    time: string;
}

export type User = {
    id: number;
    username: string;
    last_message?: {
        content: string;
        time: string;
    };
};

interface ChatState {
    chatUsers:User[];
    selectedUser: User | null;
    rooms: Room[];
    selectedRoom : Room | null;
    messages: Message[];
}

export const initialState: ChatState = {
    chatUsers: [],
    selectedUser:null,
    rooms : [],
    selectedRoom: null,
    messages: [],
}


export const fetchRooms = createAsyncThunk("chat/fetchRooms",async () => {
    const res = await fetch(API.ROOMS);
    return (await  res.json()) as Room[];
});

export const fetchMessages = createAsyncThunk(
    "chat/fetchMessage",
    async (roomId: number) => {
        const res = await fetch (`${API.MESSAGES}?room_id=${roomId}`);
        return (await res.json()) as Message[];
    }
)

export const fetchChatUsers = createAsyncThunk(
    "chat/fetchChatUsers",
    async (userId: number) => {
        const res = await fetch(`${API.CHAT_PARTNERS}?user_id=${userId}`);
        return (await res.json()) as User[];
    }
);

export const findOrCreateRoom = createAsyncThunk(
    "chat/findOrCreateRoom",
    async (userIds:number[]) => {
        const res = await fetch(`${API.FIND_OR_CREATED}`, {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({ user_ids: userIds }),
        })
        return await res.json();
    }
)



export const sendMessage = createAsyncThunk(
    "chat/sendMessage",
    async (payload :{content:string;roomId:number;userId:number}) => {
        const res = await fetch (API.MESSAGES,{
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({
                message: {
                    content: payload.content,
                    room_id:payload.roomId,
                    user_id: payload.userId,
                },
            }),
        });
        return await res.json();
    }
)
const CURRENT_USERNAME = "andi";
const chatSlice = createSlice({
    name:"chat",
    initialState,
    reducers: {
        selectRoom(state,action: PayloadAction<Room>) {
            state.selectedRoom = action.payload;
            state.messages = [];
        },
        selectUser(state, action: PayloadAction<User>) {
            state.selectedUser = action.payload;
            state.messages = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRooms.fulfilled, (state, action) => {
                state.rooms = action.payload;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.messages = action.payload;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.messages.push(action.payload);

                const targetUserId = action.payload.user === CURRENT_USERNAME
                    ? state.selectedUser?.id
                    : 1;

                const chatUser = state.chatUsers.find((u) => u.id === targetUserId);
                if (chatUser) {
                    chatUser.last_message = {
                        content: action.payload.content,
                        time: action.payload.time,
                    };
                }
            })
            .addCase(fetchChatUsers.fulfilled, (state, action) => {
                state.chatUsers = action.payload;
            });
    },
})


export const { selectRoom,selectUser } = chatSlice.actions;
export default chatSlice.reducer;