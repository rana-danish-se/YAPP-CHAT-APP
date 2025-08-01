import { useEffect } from 'react';
import NewDM from './components/new-dm';
import ProfileInfo from './components/profile-info';
import { apiClient } from '@/lib/api-client';
import { GET_DM_CONTACT_LIST, GET_USER_CHANNELS } from '@/utils/constants';
import { useAppStore } from '@/store';
import { toast } from 'sonner';
import ContactList from '@/components/ContactList';
import CreateChannel from './components/create-channel';
import logo from "../../../assets/logo.png"

const ContactsContainer = () => {
  const { setDirectMessagesContacts, directMessagesContacts, channels,setChannels } =
    useAppStore();
  useEffect(() => {
    const getContacts = async () => {
      try {
        const response = await apiClient.get(GET_DM_CONTACT_LIST, {
          withCredentials: true,
        });
        if (response.data.success) {
          setDirectMessagesContacts(response.data.contacts);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
        const getChannels = async () => {
      try {
        const response = await apiClient.get(GET_USER_CHANNELS, {
          withCredentials: true,
        });
        if (response.data.success) {
          setChannels(response.data.channels);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    getContacts();
    getChannels();
  },[]);
  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#080708] border-r-2 border-orange-400 w-full">
      <div className='pt-3'>
        <Logo />
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text={'Direct Messages'} />
          <NewDM />
        </div>
        <div className="max-w-[38vw] overflow-y-scroll scrollbar-hidden">
          <ContactList contacts={directMessagesContacts} />
        </div>
        <div className="flex items-center justify-between pr-10">
          <Title text={'Channels'} />
          <CreateChannel />
        </div>
        <div className="max-w-[38vw] overflow-y-scroll scrollbar-hidden">
          <ContactList contacts={channels} isChannel={true} />
        </div>
      </div>
      <ProfileInfo />
    </div>
  );
};

export default ContactsContainer;

const Logo = () => {
  return (
    <div className="flex  justify-center items-center gap-2 p-3">
      <img src={logo} alt="" className='h-10 mt-1' />
      <h1 className='text-4xl font-bold'>YAPP</h1>
    </div>
  );
};

// export default Logo;
const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  );
};
