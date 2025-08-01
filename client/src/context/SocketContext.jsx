import { useAppStore } from '@/store';
import { HOST } from '@/utils/constants';
import { createContext, useEffect, useContext, useRef } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef();
  const { userInfo } = useAppStore();
  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.id },
      });
      socket.current.on('connect', () => {
        console.log('Connected to socket server ' + userInfo.id);
      });

      const handleReceiveMessage = (message) => {
        const {
          selectedChatType,
          selectedChatData,
          addMessage,
          addContactInDMContacts,
        } = useAppStore.getState();

        if (
          (selectedChatType !== undefined &&
            selectedChatData._id === message.sender._id) ||
          selectedChatData._id === message.recipient._id
        ) {
          console.log('Recieved Message:' + message.content);
          addMessage(message);
          addContactInDMContacts(message);
        }
      };

      const handleRecieveChannelMessage = (message) => {
        const {
          selectedChatType,
          selectedChatData,
          addMessage,
          addChannelInChannelList,
        } = useAppStore.getState();
        if (
          selectedChatType !== undefined &&
          selectedChatData._id === message.channelId
        ) {
          addMessage(message);
        }
        addChannelInChannelList(message);
      };

      socket.current.on('receiveMessage', handleReceiveMessage);
      socket.current.on('receive-channel-message', handleRecieveChannelMessage);

      return () => {
        socket.current.disconnect();
      };
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
