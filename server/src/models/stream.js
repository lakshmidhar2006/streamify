import { StreamChat } from 'stream-chat';

import "dotenv/config";

const api_key = process.env.STEAM_API_KEY;
const api_secret = process.env.STEAM_API_SECRET;
const client = StreamChat.getInstance(api_key, api_secret);

export const upsertnewStreamUser = async (userdata) => {
    try {
        const { users } = await client.upsertUsers([userdata]);
        return users[0];
    } catch (error) {
        console.error("Error creating Stream user:", error);
        throw error;
    }
};

export const getStreamToken = (userId) => {
    return client.createToken(userId);
};
