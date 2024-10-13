"use strict";

import { Client, GatewayIntentBits } from 'discord.js';

// Discord 봇 클라이언트 생성
const client = new Client({ 
    intents: [ 
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMembers, 
        GatewayIntentBits.GuildPresences, // 사용자 상태 정보를 가져오기 위한 권한
    ] 
});

// 사용자 상태를 가져오는 함수
async function getUserStatus(guildId, userId) {
    try {
        const guild = client.guilds.cache.get(guildId); // 서버(Guild) 가져오기
        if (!guild) {
            throw new Error('Guild not found.');
        }

        const member = await guild.members.fetch(userId); // 서버 내의 사용자 정보 가져오기
        if (!member) {
            throw new Error('User not found in guild.');
        }

        const status = member.presence?.status || 'offline'; // 사용자의 상태 가져오기
        return status;
    } catch (error) {
        console.error('Error fetching Discord presence:', error);
        return null;
    }
}

// Express.js 요청 처리
export default async (req, res) => {
    const guildId = '1192087206219763753'; // 확인할 Discord 서버 ID
    const userId = '332383283470139393'; // 확인할 Discord 사용자 ID

    // 봇이 준비 완료 후 사용자 상태를 가져옵니다.
    client.once('ready', async () => {
        try {
            const status = await getUserStatus(guildId, userId); // 사용자 상태 가져오기
            if (status) {
                res.status(200).json({ status: status });
            } else {
                res.status(404).json({ error: 'User not found or no presence information available' });
            }
        } catch (error) {
            console.error('Error fetching user status:', error);
            res.status(500).json({ error: 'Failed to fetch user status' });
        }
    });
};

// 봇 로그인
client.login(process.env.DISCORD_TOKEN); // Vercel 환경변수에서 토큰 가져오기
