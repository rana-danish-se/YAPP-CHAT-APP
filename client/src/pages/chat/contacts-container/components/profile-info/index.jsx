import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { getColor } from '@/lib/utils';
import { useAppStore } from '@/store';
import { HOST, LOGOUT_ROUTE } from '@/utils/constants.js';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { FiEdit2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { IoPowerSharp } from 'react-icons/io5';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

const ProfileInfo = () => {
  const { userInfo,setUserInfo } = useAppStore();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const response = await apiClient.post(
        LOGOUT_ROUTE,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setUserInfo(null)
        navigate('/auth');
      }else{
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div className="absolute bottom-0 h-16 flex items-ceter gap-2 justify-between px-5 w-full bg-[#302b27]">
      <div className="flex gap-3 items-center justify-center">
        <div className="w-12 h-12 relative">
          <Avatar className="h-12 w-12 rounded-full overflow-hidden">
            {userInfo.image ? (
              <AvatarImage
                src={userInfo.image}
                className="object-cover  w-full h-full bg-black"
              />
            ) : (
              <div
                className={`uppercase h-12 w-12  text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                  userInfo.color
                )}`}
              >
                {userInfo.firstName
                  ? userInfo.firstName.charAt(0)
                  : userInfo.email.charAt(0)}
              </div>
            )}
          </Avatar>
        </div>
        <div>
          {userInfo.firstName && userInfo.lastName
            ? `${userInfo.firstName} ${userInfo.lastName}`
            : ''}
        </div>
      </div>
      <div className="flex gap-3">
        <Tooltip>
          <TooltipTrigger>
            <FiEdit2
              onClick={() => navigate('/profile')}
              className="text-white text-2xl font-medium cursor-pointer"
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit Your Profile</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <IoPowerSharp
              onClick={logout}
              className="text-red-500 text-2xl font-medium  cursor-pointer"
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Log Out</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default ProfileInfo;
