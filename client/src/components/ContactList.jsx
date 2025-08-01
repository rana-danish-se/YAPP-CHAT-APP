import { getColor } from '@/lib/utils';
import { useAppStore } from '@/store';
import { HOST } from '@/utils/constants';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useEffect } from 'react';

const ContactList = ({ contacts, isChannel = false }) => {
  const {
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    selectedChatType,
    setSelectedChatMessages,
  } = useAppStore();

  const handleClick = (contact) => {
    if (isChannel) setSelectedChatType('channel');
    else setSelectedChatType('contact');
    setSelectedChatData(contact);
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };

  return (
    <div className="mt-5 mb-5 w-full">
      {contacts.map((contact) => (
        <div
          onClick={() => handleClick(contact)}
          key={contact._id}
          className={`pl-10 py-2 transition-all duration-300 w-full cursor-pointer ${
            selectedChatData && selectedChatData._id === contact._id
              ? 'bg-orange-400 hover:bg-orange-500'
              : 'hover:bg-[#f1f1f111]'
          }`}
        >
          <div className="flex gap-5 items-center justify-start text-neutral-300">
            {!isChannel && (
              <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                {contact.image ? (
                  <AvatarImage
                    src={contact.image}
                    className="object-cover  w-full h-full bg-black"
                  />
                ) : (
                  <div
                    className={`
                      

                      ${
                        selectedChatData && selectedChatData._id===contact._id?"bg-[ffffff22] border border-white/50":getColor(contact.color)
                      }
                      
                      
                      uppercase h-10 w-10  text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                      contact.color
                    )}`}
                  >
                    {contact.firstName
                      ? contact.firstName.charAt(0)
                      : contact.email.charAt(0)}
                  </div>
                )}
              </Avatar>
            )}
            {isChannel && (
              <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">#</div>
            )}
            {
              isChannel?(
                <span>{contact.name}</span>
              ):(
                <span>{`${contact.firstName} ${contact.lastName}`}</span>
              )
            }
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
