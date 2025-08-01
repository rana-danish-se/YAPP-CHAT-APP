import { useAppStore } from '@/store';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ContactsContainer from './contacts-container';
import EmptyChatContainer from './empty-chat-container';
import ChatsContainer from './chat-container';

const Chat = () => {
  const {
    userInfo,
    selectedChatType,
    isUploading,
    isDownloading,
    fileUploadProgress,
    fileDownloadProgress,
  } = useAppStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast('Please setup profile to continue');
      navigate('/profile');
    }
  }, [userInfo, navigate]);
  return (
    <div className="flex h-[100vh]  bg-[#080708] text-white overflow-hidden">
      {isUploading && (
        <div className="h-[100vh] m-auto w-[100vw] fixed top-0 left-0 bg-[#00171f] flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
          <h5 className="text-5xl animate-pulse">Uploading File</h5>
          {fileUploadProgress}
        </div>
      )}
      {isDownloading && (
        <div className="h-[100vh] m-auto w-[100vw] fixed top-0 left-0 bg-[#00171f] flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
          <h5 className="text-5xl animate-pulse">Downloading File</h5>
          {fileDownloadProgress}
        </div>
      )}
      <ContactsContainer />
      {selectedChatType === undefined ? (
        <EmptyChatContainer />
      ) : (
        <ChatsContainer />
      )}
    </div>
  );
};

export default Chat;
