'use client';
import { useState } from 'react';
import { Button, Textarea, addToast } from '@heroui/react';
import CommentItem from './CommentItem';
import type { CommentMessages, CommentType } from '@/types/comment';

type Props = {
  commentableType: 'RunCase' | 'Run' | 'Case';
  commentableId?: number;
  messages: CommentMessages;
};

export default function Comments({ commentableType, commentableId, messages }: Props) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  const handleAddComment = () => {
    if (!newComment.trim() || !commentableId) return;
    const comment: CommentType = {
      id: Date.now(),
      commentableType,
      commentableId,
      userId: 1,
      content: newComment.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      User: { id: 1, username: 'You', email: 'you@example.com' },
    };
    setComments((prev) => [...prev, comment]);
    setNewComment('');
    addToast({ title: 'Success', color: 'success', description: messages.commentAdded });
  };

  const handleSaveEdit = (id: number) => {
    if (!editContent.trim()) return;
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, content: editContent.trim(), updatedAt: new Date().toISOString() } : c))
    );
    setEditingId(null);
    setEditContent('');
    addToast({ title: 'Success', color: 'success', description: messages.commentUpdated });
  };

  const handleDeleteComment = (id: number) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
    addToast({ title: 'Success', color: 'success', description: messages.commentDeleted });
  };

  if (!commentableType || !commentableId) {
    return (
      <div className="text-default-500 text-sm">
        {commentableType === 'RunCase' && !commentableId ? <p>{messages.notIncludedInRun}</p> : <p>Unknown state</p>}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-between">
      {comments.length === 0 ? (
        <div className="text-center text-default-400 py-8">
          <p>{messages.noComments}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              isEditing={editingId === comment.id}
              canEdit={true}
              editContent={editContent}
              isSubmitting={false}
              messages={messages}
              onEditContentChange={setEditContent}
              onStartEdit={() => { setEditingId(comment.id); setEditContent(comment.content); }}
              onCancelEdit={() => { setEditingId(null); setEditContent(''); }}
              onSave={() => handleSaveEdit(comment.id)}
              onDelete={() => handleDeleteComment(comment.id)}
            />
          ))}
        </div>
      )}

      <div className="mt-12">
        <Textarea
          placeholder={messages.placeholder}
          value={newComment}
          onValueChange={setNewComment}
          minRows={3}
          variant="bordered"
        />
        <Button
          color="primary"
          size="sm"
          className="mt-2"
          onPress={handleAddComment}
          isDisabled={!newComment.trim()}
        >
          {messages.addComment}
        </Button>
      </div>
    </div>
  );
}
