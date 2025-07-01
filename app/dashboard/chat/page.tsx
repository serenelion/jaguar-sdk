import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { Chat } from '@/components/chat';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
import { generateUUID } from '@/lib/utils';
import { DataStreamHandler } from '@/components/data-stream-handler';
import { auth } from '../../(auth)/auth';

export default async function ChatPage() {
  // Temporarily disable auth for testing
  // const session = await auth();

  // if (!session) {
  //   redirect('/api/auth/guest');
  // }

  // Mock session for testing
  const session = {
    user: {
      id: 'test-user',
      email: 'test@example.com',
      type: 'guest' as const,
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
  } as any; // Temporary type override for testing

  const id = generateUUID();

  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get('chat-model');

  const chatModel = modelIdFromCookie?.value || DEFAULT_CHAT_MODEL;

  return (
    <div className="flex flex-col h-screen bg-black">
      <Chat
        key={id}
        id={id}
        initialMessages={[]}
        initialChatModel={chatModel}
        initialVisibilityType="private"
        isReadonly={false}
        session={session}
        autoResume={false}
      />
      <DataStreamHandler id={id} />
    </div>
  );
}
