 'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export default function SpacesPage() {
  const router = useRouter();

  const { data: spacesResp, isLoading } = useQuery({
    queryKey: ['my-spaces-list'],
    queryFn: async () => {
      const res = await fetch('/api/v1/spaces', {
        headers: { 'x-user-id': localStorage.getItem('x-user-id') || 'dev-user-default' },
      });
      if (!res.ok) return { data: [] };
      return res.json();
    },
  });

  const spaces = spacesResp?.data || spacesResp || [];

  return (
    <div className="min-h-screen bg-[#F1F2F3]">
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">스페이스</h1>
            <p className="text-sm text-[#6B6D70]">팀과 함께하는 회고 스페이스 목록입니다</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => router.push('/dashboard/spaces/new')} className="btn-primary">새 스페이스 생성</button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">로딩중...</div>
        ) : (
          <div className="space-y-3">
            {spaces.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#6B6D70] mb-4">진행중인 스페이스가 없습니다</p>
                <button onClick={() => router.push('/dashboard/spaces/new')} className="btn-primary">스페이스 만들기</button>
              </div>
            ) : (
              spaces.map((s: any) => (
                <div key={s.id} className="p-4 bg-white rounded-xl border border-[#EAEBEC] flex items-center justify-between">
                  <div>
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-[#6B6D70]">멤버 {s.member_count || 1}명 · {s.status}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => router.push(`/dashboard/spaces/${encodeURIComponent(s.id)}`)} className="px-3 py-2 bg-white border rounded">열기</button>
                    <button onClick={async () => {
                      if (!confirm('스페이스를 삭제하면 복구할 수 없습니다. 삭제하시겠습니까?')) return;
                      try {
                        const res = await fetch(`/api/v1/spaces/${s.id}`, { method: 'DELETE', headers: { 'x-user-id': localStorage.getItem('x-user-id') || 'dev-user-default' } });
                        if (!res.ok) throw new Error('삭제 실패');
                        toast.success('스페이스가 삭제되었습니다');
                        router.refresh();
                      } catch (err) {
                        console.error(err);
                        toast.error('삭제에 실패했습니다');
                      }
                    }} className="px-3 py-2 text-red-600 border rounded">삭제</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
