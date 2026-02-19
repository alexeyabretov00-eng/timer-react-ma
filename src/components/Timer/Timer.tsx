import { Block } from '../Block';
import { StopButton } from '../StopButton';
import { StartButton } from '../StartButton';
import { PauseButton } from '../PauseButton';
import { RemoveButton } from '../RemoveButton';
import { Text } from '../Text';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const formatValue = (value: number): string => {
    const milli = value;

    const hours = Math.floor(milli / 3600000);
    const minutes = Math.floor((milli % 3600000) / 60000);
    const seconds = Math.floor(minutes > 0 ? (milli - (minutes * 60000)) / 1000 : value / 1000);

    return `${hours > 0 ? `${hours}:` : ''}${minutes > 0 ? `${minutes}:` : ''}${seconds}`;
};

type TimerProps = {
    onRemove?: () => void;
}

export const Timer = ({ onRemove }: TimerProps) => {
    const [value, setValue] = useState(0);
    const [status, setStatus] = useState('idle');
    const time = useRef(0);
    const start = useRef(0);
    const pausedTime = useRef(0);
    const intervalId = useRef<any>(0);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (intervalId.current) {
                clearTimeout(intervalId.current);
            }
        };
    }, []);

    useEffect(() => {
        if (status !== 'started') {
            return;
        }

        intervalId.current = setTimeout(updateTimer, 100);
    }, [status])

    const updateTimer = () => {
        if (status !== 'started') {
            return;
        }

        setValue(Math.floor(Date.now() - start.current));
        time.current += 100;
        
        intervalId.current = setTimeout(updateTimer, Date.now() - start.current - time.current);
    };

    const onStart = () => {
        if (!['idle', 'paused'].includes(status)) {
            return;
        }

        if (!start.current && status === 'idle') {
            start.current = Date.now();
        } else {
            start.current = start.current + (Date.now() - pausedTime.current);
        }

        pausedTime.current = 0;
        setStatus('started');
    }

    const onStop = () => {
        if (!['started', 'paused'].includes(status)) {
            return;
        }

        clearTimeout(intervalId.current);

        start.current = 0;
        time.current = 0;
        pausedTime.current = 0;

        setStatus('idle');
        setValue(0);
    }

    const onPaused = () => {
        if (status !== 'started') {
            return;
        }

        pausedTime.current = Date.now();

        clearTimeout(intervalId.current);
        setStatus('paused');
    }

    return (
        <TimerBlock>
            {onRemove && (
                <RemoveButtonWrapper>
                    <RemoveButton onClick={() => {
                        clearTimeout(intervalId.current);
                        onRemove();
                    }} />
                </RemoveButtonWrapper>
            )}
            <TimerStyled>
                <Text isActive={status === 'started'}>{formatValue(value)}</Text>
                <Separator isActive={status === 'started'}/>
                <ButtonsWrapper>
                    {['idle', 'paused'].includes(status) && <StartButton onClick={onStart} />}
                    {status === 'started' && <PauseButton onClick={onPaused} />}
                    <StopButton onClick={onStop} isActive={status === 'started'} />
                </ButtonsWrapper>
            </TimerStyled>
        </TimerBlock>
    )
};

const TimerBlock = styled(Block)`
    position: relative;
    padding-top: 32px; /* Ensure space for the button if needed, but top: 8px should be fine without extra padding if it floats over */
`;

const RemoveButtonWrapper = styled.div`
    position: absolute;
    top: 8px;
    right: 8px;
`;

const TimerStyled = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    column-gap: 50px;
    height: 100%;
    width: 100%;
`;

const ButtonsWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 50px;
`;

const Separator = styled.div<{
    isActive: boolean;
}>`
    height: 0px;
    border: 1px solid ${props => props.isActive ? '#ffffff': '#9E9E9E'};
    width: 100%;
`;
