import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Background from '../../assets/login2.png';
import victory from '../../assets/victory.svg';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { apiClient } from '../../lib/api-client.js';
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '@/utils/constants.js';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';

const Auth = () => {
  const [email, setEmail] = useState('');
  const { setUserInfo } = useAppStore();
  const [password, setPassword] = useState('');
  const [confirmPasword, setConfirmPasword] = useState('');
  const navigate = useNavigate();

  const validateSignUp = () => {
    if (!email.length) {
      toast.error('Email is required');
      return false;
    }
    if (!password.length) {
      toast.error('Password is required');
      return false;
    }
    if (confirmPasword !== password) {
      toast.error('Password and confirm password should be same.');
      return false;
    }
    return true;
  };
  const validateLogin = () => {
    if (!email.length) {
      toast.error('Email is required');
      return false;
    }
    if (!password.length) {
      toast.error('Password is required');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (validateLogin()) {
      try {
        const response = await apiClient.post(
          LOGIN_ROUTE,
          {
            email,
            password,
          },
          { withCredentials: true }
        );

        if (response.data.success) {
          setUserInfo(response.data.user);
          toast.success(response.data.message);
          if (response.data.user.profileSetup) {
            navigate('/chat');
          } else {
            navigate('/profile');
          }
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        const backendMessage = error.response?.data?.message;
        toast.error(backendMessage || 'Sign In failed. Please try again.');
      }
    }
  };

  const handleSignUp = async () => {
    if (validateSignUp()) {
      try {
        const response = await apiClient.post(
          SIGNUP_ROUTE,
          {
            email,
            password,
          },
          { withCredentials: true }
        );

        if (response.data.success) {
          setUserInfo(response.data.user);
          toast.success(response.data.message);
          navigate('/profile');
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        const backendMessage = error.response?.data?.message;
        toast.error(backendMessage || 'Signup failed. Please try again.');
      }
    }
  };

  return (
    <div className="h-[100vh] bg-[#080708] w-[100vw] flex items-center justify-center">
      <div className="h-[90vh] bg-[#212529]  text-opacity-90 shadow-3xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[70vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl text-white font-bold md:text-6xl">
                Welcome
              </h1>
              <img src={victory} alt="emoji" className="h-[100px]" />
            </div>
            <p className="font-medium text-center text-sm text-zinc-400">
              FILL IN THE DETAILS TO GET STARTED WITH YAPP
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs className="w-3/4" defaultValue="login">
              <TabsList className="bg-transparent rounded-none w-full text-zinc-400">
                <TabsTrigger
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:border-b-orange-500 p-3 transition-all data-[state=active]:text-white data-[state=active]:font-semibold duration-300 cursor-pointer "
                  value="login"
                >
                  LOGIN
                </TabsTrigger>

                <TabsTrigger
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:border-b-orange-500 p-3 transition-all data-[state=active]:text-white data-[state=active]:font-semibold duration-300 cursor-pointer "
                  value="signup"
                >
                  SIGN UP
                </TabsTrigger>
              </TabsList>
              <TabsContent
                className="flex flex-col gap-5 text-white "
                value="login"
              >
                <Input
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-full p-6 outline-none "
                  type="email"
                />
                <Input
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-full p-6 outline-none"
                  type="password"
                />
                <Button
                  className="rounded-full p-6 cursor-pointer bg-orange-500 hover:bg-orange-600"
                  onClick={handleLogin}
                >
                  Login
                </Button>
              </TabsContent>
              <TabsContent
                className="flex flex-col gap-5 text-white"
                value="signup"
              >
                <Input
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-full p-6 outline-none"
                  type="email"
                />
                <Input
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-full p-6 outline-none"
                  type="password"
                />
                <Input
                  placeholder="Confirm Password"
                  value={confirmPasword}
                  onChange={(e) => setConfirmPasword(e.target.value)}
                  className="rounded-full p-6 outline-none"
                  type="password"
                />
                <Button
                  className="rounded-full p-6 cursor-pointer  bg-orange-500 hover:bg-orange-600"
                  onClick={handleSignUp}
                >
                  Sign Up
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex justify-center items-center">
          <img src={Background} alt="" className="h-[500px]" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
