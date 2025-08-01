import { useSocket } from '@/context/SocketContext';
import { apiClient } from '@/lib/api-client';
import { useAppStore } from '@/store';
import { UPLOAD_FILE_ROUTE } from '@/utils/constants';
import EmojiPicker from 'emoji-picker-react';
import React, { useEffect, useRef, useState } from 'react';
import { GrAttachment } from 'react-icons/gr';
import { IoSend } from 'react-icons/io5';
import { RiEmojiStickerLine } from 'react-icons/ri';
import { toast } from 'sonner';

const MessageBar = () => {
  const emojiRef = useRef(null);
  const fileRef = useRef(null);
  const socket = useSocket();
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);

  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    setIsUploading,

    setFileUploadProgress,
  } = useAppStore();

  const handleSendMessage = async () => {
    if (selectedChatType === 'contact') {
      socket.emit('sendMessage', {
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: 'text',
        fileUrl: undefined,
      });
      setMessage('');
    } else if (selectedChatType === 'channel') {
      socket.emit('send-channel-message', {
        sender: userInfo.id,
        content: message,
        messageType: 'text',
        fileUrl: undefined,
        channelId: selectedChatData._id,
      });
      setMessage('');
    }
  };

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [emojiRef]);

  const handleAttachmentClick = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  const handleAttachment = async (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        setIsUploading(true);

        const res = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
          withCredentials: true,
          onUploadProgress: (data) => {
            setFileUploadProgress(Math.round((100 * data.loaded) / data.total));
          },
        });

        const { success, filePath, message } = res.data;

        if (success) {
          setIsUploading(false);
          if (selectedChatType === 'contact') {
            socket.emit('sendMessage', {
              // also fixed event name
              sender: userInfo.id,
              content: undefined,
              recipient: selectedChatData._id,
              messageType: 'file',
              fileUrl: filePath,
            });
          } else if (selectedChatType === 'channel') {
            socket.emit('send-channel-message', {
              sender: userInfo.id,
              content: undefined,
              messageType: 'file',
              fileUrl: filePath,
              channelId: selectedChatData._id,
            });
          }
        } else {
          setIsUploading(false);
          console.log(message);
        }
      }
    } catch (error) {
      setIsUploading(false);
      toast.error(error.message);
    }
  };

  return (
    <div className="h-[10vh] flex justify-center items-center px-8 mb-6 gap-6">
      <div className="flex-1 flex bg-[#302b27] rounded-md items-center gap-5 pr-5">
        <input
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={handleAttachmentClick}
          className="text-[#6b7f82] hover:text-white focus:border-none focus:outline-none duration-300 transition-all cursor-pointer"
        >
          <GrAttachment className="text-2xl" />
        </button>
        <input
          type="file"
          ref={fileRef}
          className="hidden"
          onChange={handleAttachment}
        />
        <div className="relative">
          <button
            className="text-[#6b7f82] hover:text-white focus:border-none focus:outline-none duration-300 transition-all cursor-pointer"
            onClick={() => setOpen(!open)}
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          <div className="absolute bottom-16 right-0" ref={emojiRef}>
            <EmojiPicker
              theme="dark"
              open={open}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
        <button
          onClick={handleSendMessage}
          className="bg-orange-400 rounded-md flex items-center justify-center p-3  hover:text-white focus:border-none focus:outline-none duration-300 hover:bg-orange-500 transition-all cursor-pointer"
        >
          <IoSend className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default MessageBar;
