import Page from '../components/page';
import Section from '../components/section';
import React from 'react';
import {  Card, Avatar, CardHeader, CardBody, CardFooter, Divider} from '@nextui-org/react';


const ProfilePage: React.FC = () => {
  return (
    <Page>
      <div className='justify-center w-auto h-auto'>
        <h2 className = 'text-center font-semibold text-2xl'>My Profile</h2>
      </div>
      <Section>
          <div className="relative flex justify-center items-center h-screen">
          <Card className="absolute top-6 bg-white shadow-lg rounded-lg p-6 w-full">
            {/* Profile Picture */}
            <CardHeader className="flex justify-center display-block">
              <Avatar
                src="/images/Ian (1).png" 
                alt="Profile"
                className="w-24 h-24 rounded-full shadow-lg"
              />
            </CardHeader>
                <h2 className="text-center font-semibold text-2xl mt-4 ">
                Ian Applebaum
                </h2>
                {/* User Info */}
                <p className="text-center text-sm text-gray-500 mt-2">
                  Member since 2024
                </p>
            <CardBody className="flex grid grid-cols-3 gap-4 justify-between mt-6 text-center"> 
              {/* this is all fake data*/}
               <div className='flex flex-col items-center flex-1'>
                 {/* practicing word streak taken from daily activity*/}
                  <div className ='flex items-center '>
                  <p className="text-xl font-bold">3</p>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ea580c" className="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
                  </svg>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Practice Streak</p>
                </div>

                {/* Total words said ever*/}
                <div className='flex flex-col items-center flex-1'>
                  <p className="text-xl font-bold">8701</p>
                  <p className="text-sm text-gray-500 mt-2">Total Words Today</p>
                </div>

                {/* this will go to a record of their recordings if they choose to save them*/}
                <div className='flex flex-col items-center flex-1'>
                  <p className="text-xl font-bold">98%</p>
                  <p className="text-sm text-gray-500 mt-2">Clean Speech</p>
                </div>
            </CardBody>
            {/* Button */}
            <div className="mt-6">
              <button className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                Share Profile
              </button>
            </div>
          </Card>
        </div>
      </Section>
    </Page>
  );
};

export default ProfilePage;
