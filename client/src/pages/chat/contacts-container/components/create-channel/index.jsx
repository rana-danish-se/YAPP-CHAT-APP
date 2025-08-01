import { useEffect, useState } from 'react';

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

import Lottie from 'react-lottie';
import { apiClient } from '@/lib/api-client';
import {
  CREATE_CHANNEL_ROUTE,
  GET_ALL_CONTACTS,
  HOST,
  SEARCH_CONTACT_ROUTE,
} from '@/utils/constants';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/button';
import MultipleSelector from '@/components/ui/multipleselect';

const CreateChannel = () => {
  const { addChannel } =
    useAppStore();

  const [openNewChannelModel, setOpenNewChannelModel] = useState(false);

  const [allContacts, setAllContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [channelName, setChannelName] = useState('');

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await apiClient.get(GET_ALL_CONTACTS, {
          withCredentials: true,
        });
        if (response.data.success) {
          console.log(response.data.contacts);
          setAllContacts(response.data.contacts);
        } else {
          toast.error('Error getting contacts');
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    getData();
  }, []);

  const createChannel = async () => {
    try {
      if (channelName.length > 0 && selectedContacts.length > 0) {
        const res = await apiClient.post(
          CREATE_CHANNEL_ROUTE,
          {
            name: channelName,
            members: selectedContacts.map((contact) => contact.value),
          },
          { withCredentials: true}
        );
       if(res.data.success){
        setChannelName("");
        setSelectedContacts([]);
        setOpenNewChannelModel(false);
        addChannel(res.data.channel);
       }
      } else {
        toast.error("Please enter name and selected memebers for channel.")
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger>
          <FaPlus
            className="text-orange-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer duration-300 transition-all"
            onClick={() => setOpenNewChannelModel(true)}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>Create New Channel</p>
        </TooltipContent>
      </Tooltip>
      <Dialog open={openNewChannelModel} onOpenChange={setOpenNewChannelModel}>
        <DialogContent className="bg-[#1c1b1e] border-none  text-white w-[400px] h-[300px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Please fill the details for new channel</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Channel Name"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => setChannelName(e.target.value)}
              value={channelName}
            />
          </div>
          <div>
            <MultipleSelector
              className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
              defaultOptions={allContacts}
              placeholder="Add Contacts"
              value={selectedContacts}
              onChange={setSelectedContacts}
              emptyIndicator={
                <p className="text-center text-lg leading-10 text-gray-600">
                  No results found
                </p>
              }
            />
          </div>
          <div>
            <Button
              onClick={createChannel}
              className="w-full cursor-pointer bg-orange-700 hover:bg-orange-900 transition-all duration-300"
            >
              Create Channel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannel;
