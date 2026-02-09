import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Streamer from '@/models/Streamer';
import Parser from 'rss-parser';

// Connect DB helper needs to be verified, assuming standard lib/db
// If lib/db doesn't exist I'll need to create it, but usually it does in this project structure.

export async function GET(request: Request) {
    await connectDB();
    const streamers = await Streamer.find({});
    console.log(`[API] Streamers Found: ${streamers.length} | DB: ${mongoose.connection.name}`);
    return NextResponse.json(streamers);
}

export async function POST(request: Request) {
    await connectDB();
    try {
        const body = await request.json();
        const { channelLink, notificationChannelId, roleIdToPing, gameRoleId, notifyType, guildId } = body;

        // Basic Validation
        if (!channelLink || !notificationChannelId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Extract ID
        const match = channelLink.match(/youtube\.com\/channel\/([a-zA-Z0-9_-]+)/);
        const channelId = match ? match[1] : null;

        if (!channelId) {
            return NextResponse.json({ error: 'Invalid YouTube Link (must include /channel/ID)' }, { status: 400 });
        }

        // Check if exists
        const exists = await Streamer.findOne({ channelId });
        if (exists) {
            return NextResponse.json({ error: 'Streamer already monitored' }, { status: 400 });
        }

        // Fetch Name
        const parser = new Parser();
        let channelName = 'Unknown Channel';
        try {
            const feed = await parser.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
            if (feed && feed.title) channelName = feed.title;
        } catch (e) {
            console.error('RSS Fetch Error', e);
        }

        const newStreamer = await Streamer.create({
            guildId: guildId || process.env.GUILD_ID, // Fallback if not passed
            platform: 'youtube',
            channelLink,
            channelName,
            channelId,
            notificationChannelId,
            roleIdToPing,
            gameRoleId,
            notifyType,
            lastContentId: 'init'
        });

        return NextResponse.json(newStreamer);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    await connectDB();
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        await Streamer.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
