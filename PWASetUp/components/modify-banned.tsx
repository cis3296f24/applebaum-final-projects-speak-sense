import React, {useState} from 'react'
import { Textarea,Card, Button, CardFooter } from '@nextui-org/react'
import path from "path"

interface ModifyBannedTextProps {
    bannedWords: string[];
    setBannedWords: React.Dispatch<React.SetStateAction<string[]>>;
}

const ModifyBannedText: React.FC<ModifyBannedTextProps> = ({bannedWords, setBannedWords}) => {
    const [localBannedWords, setLocalBannedWords] = useState<string>("");
    
    const handleSave = () => {
        const bannedWordsArray = localBannedWords
        .split(",")
        .map((word) => word.trim())
        .filter((word)=>word); 

        setBannedWords(bannedWordsArray);
        setLocalBannedWords('');
    };
        
    return(
    <Card className='p-6, mw-400px, mt-10, display:flex, flexDirection: column, alignItems: center'>
        <Textarea 
            className ='rounded-b-none'
            label='Banned Words'
            placeholder='Enter banned words, separated by commas (e.g., like, you know, stop)'
            value = {localBannedWords}
            onChange={(e) => setLocalBannedWords(e.target.value)}
        />
        <Button className='rounded-t-none' onPress={handleSave}>
            Save Changes
        </Button>
        <CardFooter>
            <h4>Current Banned Words:</h4>
            <p>{ bannedWords.join(', ') || 'None' }</p>
        </CardFooter>
    </Card>
    )
}
export default ModifyBannedText;