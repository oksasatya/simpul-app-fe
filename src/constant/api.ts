export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const API= {
    USERS:`${API_BASE_URL}/users`,
    ROOMS:`${API_BASE_URL}/rooms`,
    MESSAGES:`${API_BASE_URL}/messages`,
    CHAT_PARTNERS: `${API_BASE_URL}/users/chat_partners`,
    FIND_OR_CREATED: `${API_BASE_URL}/rooms/find_or_create`,
}