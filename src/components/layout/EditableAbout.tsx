'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import HighlightedText from './HighlightedText';
import { updateAboutMeText } from '@/app/actions';

type EditableAboutProps = {
  initialAboutText: string;
};

export default function EditableAbout({ initialAboutText }: EditableAboutProps) {
  // State for Title
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [title, setTitle] = useState('About Me');

  // State for Content
  const [isContentEditing, setIsContentEditing] = useState(false);
  const [contentText, setContentText] = useState(initialAboutText);
  const [isPending, startTransition] = useTransition();

  const handleTitleDoubleClick = () => {
    setIsTitleEditing(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleTitleSave = () => {
    setIsTitleEditing(false);
    // Here you would typically save the title if it were persisted
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    }
    if (e.key === 'Escape') {
      setIsTitleEditing(false);
    }
  };

  const handleContentDoubleClick = () => {
    setIsContentEditing(true);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContentText(e.target.value);
  };

  const handleContentSave = () => {
    setIsContentEditing(false);
    startTransition(async () => {
      await updateAboutMeText(contentText);
    });
  };

  const handleContentKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleContentSave();
    }
    if (e.key === 'Escape') {
      setIsContentEditing(false);
    }
  };

  const titleInputRef = useRef<HTMLInputElement>(null);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isTitleEditing) {
      titleInputRef.current?.focus();
    }
  }, [isTitleEditing]);

  useEffect(() => {
    if (isContentEditing) {
      contentTextareaRef.current?.focus();
      contentTextareaRef.current?.setSelectionRange(
        contentTextareaRef.current.value.length,
        contentTextareaRef.current.value.length
      );
    }
  }, [isContentEditing]);

  const editableStyles = "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md p-2 transition-colors duration-200";

  return (
    <>
      {isTitleEditing ? (
        <input
          ref={titleInputRef}
          type="text"
          value={title}
          onChange={handleTitleChange}
          onBlur={handleTitleSave}
          onKeyDown={handleTitleKeyDown}
          className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 bg-transparent border-2 border-blue-500 rounded-md w-full"
        />
      ) : (
        <h2
          className={`text-4xl font-bold tracking-tight sm:text-5xl mb-6 ${editableStyles}`}
          onDoubleClick={handleTitleDoubleClick}
        >
          {title}
        </h2>
      )}
      <div
        className={`text-lg text-muted-foreground space-y-4 ${isPending ? 'opacity-50' : ''} ${editableStyles}`}
        onDoubleClick={handleContentDoubleClick}
      >
        {isContentEditing ? (
          <textarea
            ref={contentTextareaRef}
            value={contentText}
            onChange={handleContentChange}
            onBlur={handleContentSave}
            onKeyDown={handleContentKeyDown}
            className="text-lg bg-transparent border-2 border-blue-500 rounded-md w-full min-h-[150px]"
            rows={5}
          />
        ) : (
          <HighlightedText text={contentText} />
        )}
      </div>
      {isPending && <p className="text-sm text-muted-foreground mt-2">Saving...</p>}
    </>
  );
}
