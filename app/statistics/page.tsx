"use client";

import { useState, useEffect  } from 'react'; 
import { useAuth } from "@/context/AuthContext";
import { fetchTimeSessions } from "@/utils/timeSessionsDB";

import Navbar from "@/components/Navbar";

interface Session {
    id: string;
    user_id?: string;
    start_time: Date;
    end_time: Date | null;
    duration: number | 0;
    group: string | null;
  }


export default function LoginPage() {

    const { user } = useAuth();

    const [totalTime, setTotalTime] = useState<number>(0);

    const [isLoading, setIsLoading] = useState(false);
    
    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      };


      const loadSessions = async () => {
        setIsLoading(true);
        if (!user) return;

        try {
            const temp = await fetchTimeSessions(user);
            setTotal(temp);
           }
           catch (error) {
            console.error('Error loading sessions:', error);
           }
           finally {
            setIsLoading(false);
           }
      };

      const setTotal = (sessions: Session[]) => {
        const total = sessions.reduce((sum, session) => sum + session.duration, 0);
        setTotalTime(total);
      };

      useEffect(() => {
        if (user) {
          loadSessions();
          
        }
      }, [user]);


  return (
    <div className="min-h-screen w-screen bg-gray-800">
      <Navbar/>
        <h1 className="w-full text-2xl text-center pt-5">Statistics</h1>
        
        <div className="w-5/6 mx-auto bg-gray-700 min-h-96 rounded-md shadow-md p-14 mt-12 
        flex flex-row">
            <div className='w-1/4  bg-gray-600 text-center 
            rounded-md shadow-md'>
                <div className='text-2xl font-semibold mt-5 border-b-2 border-gray-700'>
                    Total Time
                </div>
                {
                    isLoading ? (
                        <div>Loading...</div>
                    ) : (
                  <div className="h-full w-full flex flex-col gap-9 mt-10">
                  <div className='text-2xl font-semibold text-shadow-2xs hover:scale-120 transition-all duration-300'>
                      {formatTime(totalTime)} Hours
                  </div>

                  <div className='text-lg font-semibold text-shadow-2xs transition-all duration-300
                  flex flex-col gap-2 mx-auto text-center opacity-75'>
                    <div className='flex flex-row gap-2 text-center w-full justify-center'>
                      <p>{Math.floor(totalTime / 86400)} Days</p>
                      <p>{Math.floor((totalTime % 86400)/3600)} Hours</p>
                      </div>
                      <div className='flex flex-row gap-2 text-center w-full justify-center'>
                      <p>{Math.floor((totalTime % 3600) / 60)} Minutes</p>
                      <p>{Math.floor(totalTime % 60)} Seconds</p>
                  </div>
                  </div>

                </div>
                    )
                }
            </div>
            
        </div>
    </div>
  );
}