import { apiClient } from '@/lib/api-client';
import { useAppStore } from '@/store';
import {
  GET_CHANNEL_MESSAGES,
  GET_MESSAGES_ROUTE,
} from '@/utils/constants';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { MdFolderZip } from 'react-icons/md';
import { IoArrowDown, IoCloseSharp } from 'react-icons/io5';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { getColor } from '@/lib/utils';
import axios from 'axios';

const MessageContainer = () => {
  const ScrollRef = useRef();
  const {
    selectedChatType,
    selectedChatData,
    setIsDownloading,
    userInfo,
    setFileDownloadProgress,
    selectedChatMessages,
    setSelectedChatMessages,
  } = useAppStore();

  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_MESSAGES_ROUTE,
          { id: selectedChatData._id },
          { withCredentials: true }
        );
        if (response.data.success) {
          setSelectedChatMessages(response.data.messages);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    const getChannelMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_CHANNEL_MESSAGES,
          { channelId: selectedChatData._id },
          { withCredentials: true }
        );
        if (response.data.success) {
          setSelectedChatMessages(response.data.messages);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (selectedChatData._id) {
      if (selectedChatType === 'contact') getMessages();
      else if (selectedChatType === 'channel') getChannelMessages();
    }
  }, [selectedChatData, selectedChatType]);

  useEffect(() => {
    if (ScrollRef.current) {
      ScrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChatMessages]);

  const checkIfImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

 
const downloadFile = async (url) => {
  try {
    setIsDownloading(true);
    setFileDownloadProgress(0);

    const response = await axios.get(url, {
      responseType: 'blob',
      // Important: No withCredentials here!
      onDownloadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        const percentCompleted = Math.round((loaded * 100) / total);
        setFileDownloadProgress(percentCompleted);
      },
    });

    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = urlBlob;
    link.setAttribute('download', url.split('/').pop());
    document.body.append(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
  } catch (err) {
    console.log(err);
    toast.error("Download failed.");
  } finally {
    setIsDownloading(false);
    setFileDownloadProgress(0);
  }
};

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format('YYYY-MM-DD');
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-orange-500 my-2">
              {moment(message.timestamp).format('LL')}
            </div>
          )}
          {selectedChatType === 'contact' && renderDMMessages(message)}
          {selectedChatType === 'channel' && renderChannelMessages(message)}
        </div>
      );
    });
  };

  const renderDMMessages = (message) => {
    const isSender = message.sender === selectedChatData._id;
    const isImage = checkIfImage(message.fileUrl);
    return (
      <div className={isSender ? 'text-left' : 'text-right'}>
        {message.messageType === 'text' && (
          <div
            className={`${
              !isSender
                ? 'bg-orange-400/5 text-orange-400 border-orange-500'
                : 'bg-[#2a2b33]/5 text-white/80 border-white/20'
            } border inline-block p-4 my-1 max-w-[50%] break-words`}
          >
            {message.content}
          </div>
        )}
        {message.messageType === 'file' && (
          <div
            className={`${
              !isSender
                ? 'bg-orange-400/5 text-orange-400 border-orange-500'
                : 'bg-[#2a2b33]/5 text-white/80 border-white/20'
            } border inline-block p-4 my-1 max-w-[50%] break-words`}
          >
            {isImage ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setShowImage(true);
                  setImageUrl(message.fileUrl);
                }}
              >
                <img
                  src={message.fileUrl}
                  width={300}
                  height={300}
                  alt="uploaded file"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <span className="text-white/8 text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </span>
                <span>{message.fileUrl.split('/').pop()}</span>
                <span
                  onClick={() => downloadFile(message.fileUrl)}
                  className="bg-black/20 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300 p-2"
                >
                  <IoArrowDown />
                </span>
              </div>
            )}
          </div>
        )}
        <div className="text-xs text-gray-600">
          {moment(message.timestamp).format('LT')}
        </div>
      </div>
    );
  };

  const renderChannelMessages = (message) => {
    const isSender = message.sender._id === userInfo.id;
    const isImage = checkIfImage(message.fileUrl);
    return (
      <div className={`mt-5 ${!isSender ? 'text-left' : 'text-right'}`}>
        {message.messageType === 'text' && (
          <div
            className={`${
              isSender
                ? 'bg-orange-400/5 text-orange-400 border-orange-500'
                : 'bg-[#2a2b33]/5 text-white/80 border-white/20'
            } border inline-block p-4 my-1 max-w-[50%] break-words`}
          >
            {message.content}
          </div>
        )}

        {message.messageType === 'file' && (
          <div
            className={`${
              isSender
                ? 'bg-orange-400/5 text-orange-400 border-orange-500'
                : 'bg-[#2a2b33]/5 text-white/80 border-white/20'
            } border inline-block p-4 my-1 max-w-[50%] break-words`}
          >
            {isImage ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setShowImage(true);
                  setImageUrl(message.fileUrl);
                }}
              >
                <img
                  src={message.fileUrl}
                  width={300}
                  height={300}
                  alt="uploaded"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <span className="text-white/8 text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </span>
                <span>{message.fileUrl.split('/').pop()}</span>
                <span
                  onClick={() => downloadFile(message.fileUrl)}
                  className="bg-black/20 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300 p-2"
                >
                  <IoArrowDown />
                </span>
              </div>
            )}
          </div>
        )}

        {!isSender ? (
          <div className="flex items-center justify-start gap-3 ml-4 mt-2">
            <Avatar className="h-8 w-8 rounded-full overflow-hidden">
              {message.sender.image ? (
                <AvatarImage
                  src={message.sender.image}
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-8 w-8 text-lg border flex items-center justify-center rounded-full ${getColor(
                    message.sender.color
                  )}`}
                >
                  {message.sender.firstName
                    ? message.sender.firstName.charAt(0)
                    : message.sender.email.charAt(0)}
                </div>
              )}
            </Avatar>
            <span className="text-sm text-white/60">
              {message.sender.firstName}
            </span>
            <span className="text-xs text-white/60">
              {moment(message.timestamp).format('LT')}
            </span>
          </div>
        ) : (
          <div className="text-xs mt-1 text-white/60">
            {moment(message.timestamp).format('LT')}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={ScrollRef} />
      {showImage && (
        <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
          <div>
            <img
              src={imageUrl}
              alt="Preview"
              className="max-h-[80vh] max-w-[90vw] object-contain"
            />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            <button
              className="bg-black/20 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300 p-2"
              onClick={() => downloadFile(imageUrl)}
            >
              <IoArrowDown />
            </button>
            <button
              className="bg-black/20 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300 p-2"
              onClick={() => {
                setShowImage(false);
                setImageUrl(null);
              }}
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
