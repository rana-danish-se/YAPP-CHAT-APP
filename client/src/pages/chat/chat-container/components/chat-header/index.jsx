import { getColor } from '@/lib/utils';
import { useAppStore } from '@/store';
import { HOST } from '@/utils/constants';
import { RiCloseFill } from 'react-icons/ri';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();
  return (
    <div className="h-[10vh] border-b-2 border-orange-400 flex items-center justify-between px-20 py-8">
      <div className="flex gap-5 items-center justify-between w-full">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 relative">
            {selectedChatType === 'contact' ? (
              <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                {selectedChatData.image ? (
                  <AvatarImage
                    src={selectedChatData.image}
                    className="object-cover  w-full h-full bg-black"
                  />
                ) : (
                  <div
                    className={`uppercase h-12 w-12  text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                      selectedChatData.color
                    )}`}
                  >
                    {selectedChatData.firstName
                      ? selectedChatData.firstName.charAt(0)
                      : selectedChatData.email.charAt(0)}
                  </div>
                )}
              </Avatar>
            ) : (
              <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                #
              </div>
            )}
          </div>
          <div className="text-orange-400">
            {selectedChatType === 'channel' && selectedChatData?.name}
            {selectedChatType === 'contact' &&
              (selectedChatData?.firstName
                ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
                : selectedChatData?.email)}
          </div>
        </div>
        <div className="flex items-center justify-center gap-5">
          <button className="text-neutral-500 hover:text-white focus:border-none focus:outline-none duration-300 transition-all cursor-pointer">
            <RiCloseFill onClick={closeChat} className="text-3xl text-orange-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
