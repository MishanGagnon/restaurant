const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Ensure you have your environment variables set correctly
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
    const channel = supabase.channel('realtime-notes', {
        config: {
            presence: {
                key: 'user-1234' // Unique identifier for the user
            }
        }
    });

    channel
        .on('presence', { event: 'sync' }, () => {
            const newState = channel.presenceState();
            console.log('Presence Sync:', newState);
        })
        .subscribe()

    // Keep the process running to allow real-time updates
    process.stdin.resume();
}

main().catch(console.error);