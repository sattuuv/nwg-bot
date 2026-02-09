import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Guild from '@/models/Guild';

export async function GET(request: Request) {
    await connectDB();
    const guildId = process.env.GUILD_ID;

    if (!guildId) return NextResponse.json({ error: 'GUILD_ID not configured' }, { status: 500 });

    try {
        let guild = await Guild.findOne({ guildId });

        // If no config exists, create default
        if (!guild) {
            guild = await Guild.create({ guildId });
        }

        return NextResponse.json(guild);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    await connectDB();
    const guildId = process.env.GUILD_ID;

    try {
        const body = await request.json();
        const { module, enabled } = body;

        // Toggle Module
        if (module) {
            const updatePath = `modules.${module}.enabled`;
            const guild = await Guild.findOneAndUpdate(
                { guildId },
                { $set: { [updatePath]: enabled } },
                { new: true }
            );
            return NextResponse.json(guild);
        }

        // Full Update
        const guild = await Guild.findOneAndUpdate(
            { guildId },
            { $set: body },
            { new: true }
        );
        return NextResponse.json(guild);

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
