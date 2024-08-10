import React, {useEffect, useState} from 'react';
import {Typography, Fade} from '@mui/material';

interface AnimatedTextProps {
    text: string;
    variant: 'body1' | 'body2' | 'caption';
    color?: string;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({text, variant, color}) => {
    const [displayText, setDisplayText] = useState(text);
    const [show, setShow] = useState(true);

    useEffect(() => {
        if (text !== displayText) {
            setShow(false);
            const timer = setTimeout(() => {
                setDisplayText(text);
                setShow(true);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [text, displayText]);

    return (
        <Fade in={show} timeout={100}>
            <Typography variant={variant} color={color} noWrap>
                {displayText}
            </Typography>
        </Fade>
    );
};

export default AnimatedText;