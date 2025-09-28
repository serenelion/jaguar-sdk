import { cookies } from 'next/headers';
import { Suspense } from 'react';

import { JaguarSidebar } from '@/components/jaguar-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { auth } from '../(auth)/auth';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, cookieStore] = await Promise.all([auth(), cookies()]);
  const isCollapsed = cookieStore.get('sidebar:state')?.value !== 'true';

  return (
    <div className="min-h-screen bg-black text-white">
      <SidebarProvider defaultOpen={!isCollapsed}>
        <JaguarSidebar user={session?.user} />
        <SidebarInset className="bg-black">
          <div className="flex flex-1 flex-col">
            <Suspense fallback={
              <div className="flex-1 flex items-center justify-center">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[rgb(217,181,113)]" />
                  <span className="text-gray-400">Loading...</span>
                </div>
              </div>
            }>
              {children}
            </Suspense>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
