import { useState } from 'react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { FaPlus } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import { animationDefaultOptions, getColor } from '@/lib/utils';
import Lottie from 'react-lottie';
import { apiClient } from '@/lib/api-client';
import { HOST, SEARCH_CONTACT_ROUTE } from '@/utils/constants';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppStore } from '@/store';

const NewDM = () => {
  const { setSelectedChatType, setSelectedChatData } = useAppStore();

  const [openNewContactModel, setOpenNewContactModel] = useState(false);
  const [searchedContacts, setsearchedContacts] = useState([]);
  const searchContact = async (contact) => {
    // If input is empty, clear the contact list and return
    console.log(contact);
    if (!contact.trim()) {
      setsearchedContacts([]);
      return;
    }
    try {
      const response = await apiClient.post(
        SEARCH_CONTACT_ROUTE,
        { searchTerm: contact },
        { withCredentials: true }
      );
      if (response.data.success && response.data.contacts) {
        setsearchedContacts(response.data.contacts);
      } else {
        setsearchedContacts([]);
      }
    } catch (error) {
      toast.error(error);
    }
    console.log(searchedContacts);
  };

  const selectNewContact = (contact) => {
    setSelectedChatData(contact);
    setSelectedChatType('contact');
    setOpenNewContactModel(false);
    setsearchedContacts([]);
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger>
          <FaPlus
            className="text-orange-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer duration-300 transition-all"
            onClick={() => setOpenNewContactModel(true)}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>Select New Contact</p>
        </TooltipContent>
      </Tooltip>
      <Dialog open={openNewContactModel} onOpenChange={setOpenNewContactModel}>
        <DialogContent className="bg-[#1c1b1e] border-none  text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Please select a contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Search contact"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => searchContact(e.target.value)}
            />
          </div>

          {searchedContacts?.length === 0 ? (
            <div className="flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center  duration-1000 transition-all">
              <Lottie
                isClickToPauseDisabled={true}
                height={100}
                width={100}
                options={animationDefaultOptions}
              />
              <div className="text-opacity-90 text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl text-3xl transition-all duration-300 text-center">
                <h3 className="poppins-medium">
                  Hi<span className="text-orange-500">!</span> Search new{' '}
                  <span className="text-orange-500">contact</span>
                </h3>
              </div>
            </div>
          ) : (
            <ScrollArea className="h-[250px]">
              <div className="flex flex-col gap-5">
                {searchedContacts.map((contact) => {
                  return (
                    <div
                      key={contact._id}
                      className="flex gap-3 items-center cursor-pointer"
                      onClick={() => selectNewContact(contact)}
                    >
                      <div className="w-12 h-12 relative">
                        <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                          {contact.image ? (
                            <AvatarImage
                              src={contact.image}
                              className="object-cover  w-full h-full bg-black"
                            />
                          ) : (
                            <div
                              className={`uppercase h-12 w-12  text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                                contact.color
                              )}`}
                            >
                              {contact.firstName
                                ? contact.firstName.charAt(0)
                                : contact.email.charAt(0)}
                            </div>
                          )}
                        </Avatar>
                      </div>
                      <div className="flex flex-col">
                        <span>
                          {contact.firstName && contact.lastName
                            ? `${contact.firstName} ${contact.lastName}`
                            : contact.email}
                        </span>
                        <span className="text-xs">{contact.email}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDM;
