import React, {useState, useEffect} from 'react'
import {Card, Progress, CardBody, Image, CardFooter} from '@nextui-org/react'
//make micCard act as button for speech recognition 
interface MicCardProps {
    isMicActive: boolean;
    isBadWordDetected: boolean;
    onToggleMic: () => void;
}

const MicCard: React.FC <MicCardProps> = ({isMicActive, isBadWordDetected, onToggleMic}) =>{
    const cardClass = `flex justify-center items-center w-96 h-96 shadow-2xl
        ${isBadWordDetected ? 'bg-gradient-to-br from-black to-red-700' : 'bg-gradient-to-br from-sky-600 to-teal-600'}
        ${isMicActive ? 'animate-pulse' : ''}`;
        return (
            <div className="flex justify-center items-center h-96">
                <Card
                    isFooterBlurred
                    radius="lg"
                    className={cardClass}
                    isPressable
                    onPress={onToggleMic}>
                  <CardBody className='justify-center items-center aspect-square z-0'>
                    <Image
                            alt='microphone'
                            className='object-cover w-auto h-auto z-0'
                            src="../images/microphone.svg"
                    />
                  </CardBody>
                </Card>
            </div>
    );
};

export default MicCard;