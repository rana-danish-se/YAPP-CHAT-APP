import ChatHeader from './components/chat-header';
import MessageBar from './components/message-bar';
import MessageContainer from './components/message-container';

const ChatsContainer = () => {
  return (
    <div className="fixed top-0 h-[100vh] w-[100vw] bg-[#141414] flex flex-col md:static md:flex-1">
      <ChatHeader />
      <MessageContainer />
      <MessageBar />
    </div>
  );
};

export default ChatsContainer;
