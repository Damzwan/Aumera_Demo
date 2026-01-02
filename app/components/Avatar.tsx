'use client'

import {useState} from 'react';
import {DotLottie, DotLottieReact} from '@lottiefiles/dotlottie-react';

interface AvatarProps {
    isStreaming: boolean;
}

export default function Avatar({isStreaming}: AvatarProps) {
    const [dotLottie, setDotLottie] = useState<DotLottie | null>(null);

    // TODO in case we want a talking animation, but i could not find the right lottie
    // useEffect(() => {
    //     if (dotLottie) {
    //         isStreaming ? dotLottie.play() : dotLottie.pause();
    //     }
    // }, [isStreaming, dotLottie]);

    return (
        <div className="relative w-64 h-64 flex items-center justify-center">
            <div
                className={`absolute inset-0 bg-blue-500 rounded-full blur-3xl 
                opacity-20 transition-opacity duration-500 ${isStreaming ? 'opacity-40' : 'opacity-0'}`}/>

            <DotLottieReact
                src="lottie/monster.lottie"
                loop
                autoplay={true}
                dotLottieRefCallback={setDotLottie}
                backgroundColor="transparent"
                className="w-full h-full z-10"
            />
        </div>
    );
}