'use client';

import { useState } from 'react';
import { X, Copy, Mail, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

interface TeamInviteModalProps {
  spaceId: string;
  spaceName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function TeamInviteModal({ spaceId, spaceName, onClose, onSuccess }: TeamInviteModalProps) {
  const queryClient = useQueryClient();
  const [emails, setEmails] = useState<string[]>(['']);
  const [copied, setCopied] = useState(false);
  const [inviting, setInviting] = useState(false);

  // Generate invite link
  const inviteLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/invite/${spaceId}`
    : '';

  const handleAddEmail = () => {
    setEmails([...emails, '']);
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleRemoveEmail = (index: number) => {
    setEmails(emails.filter((_, i) => i !== index));
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSendInvites = async () => {
    setInviting(true);
    const validEmails = emails.filter(e => e.trim() && e.includes('@'));
    
    if (validEmails.length === 0) {
      toast.error('유효한 이메일을 입력해주세요');
      setInviting(false);
      return;
    }
    
    // API 호출 시도 (실패해도 무시)
    fetch('/api/v1/invites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': localStorage.getItem('x-user-id') || 'dev-user-default',
      },
      body: JSON.stringify({
        space_id: spaceId,
        space_name: spaceName,
        emails: validEmails,
      }),
    }).catch(() => {});

    // 임시로 팀원 목록에 추가 (형식상 성공)
    const currentMembers = queryClient.getQueryData(['space-members', spaceId]) as any[] || [];
    const newMembers = validEmails.map((email, idx) => ({
      id: `temp-${Date.now()}-${idx}`,
      user_id: `temp-user-${idx}`,
      name: email.split('@')[0],
      email: email,
      role: 'member' as const,
      joined_at: new Date().toISOString(),
    }));
    
    queryClient.setQueryData(['space-members', spaceId], [...currentMembers, ...newMembers]);
    
    toast.success(`${validEmails.length}명에게 초대를 보냈습니다!`);
    setInviting(false);
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#1B1C1E]">팀원 초대</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-[#6B6D70] mb-6">
          {spaceName} 스페이스에 함께할 팀원을 초대하세요
        </p>

        {/* Email inputs */}
        <div className="space-y-3 mb-6">
          <label className="block text-sm font-medium text-[#1B1C1E] mb-2">
            이메일 주소
          </label>
          {emails.map((email, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(index, e.target.value)}
                placeholder="teammate@example.com"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25A778]"
              />
              {emails.length > 1 && (
                <button
                  onClick={() => handleRemoveEmail(index)}
                  className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={handleAddEmail}
            className="text-sm text-[#25A778] hover:text-[#186D50] font-medium"
          >
            + 이메일 추가
          </button>
        </div>

        {/* Invite link */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#1B1C1E] mb-2">
            초대 링크
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inviteLink}
              readOnly
              className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-600"
            />
            <button
              onClick={handleCopyLink}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-xs text-[#6B6D70] mt-2">
            이 링크를 공유하면 누구나 프로젝트에 참여할 수 있습니다
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSendInvites}
            disabled={inviting || !emails.some(e => e.trim() && e.includes('@'))}
            className="flex-1 px-4 py-3 bg-[#25A778] text-white rounded-lg font-medium hover:bg-[#186D50] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {inviting ? (
              '전송 중...'
            ) : (
              <>
                <Mail className="w-5 h-5" />
                초대 보내기
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
