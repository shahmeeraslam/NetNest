// hooks/use-pusher.ts
import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';

interface UsePusherProps {
  channelName: string;
  onEvent: (event: string, data: any) => void;
}

export const usePusher = ({ channelName, onEvent }: UsePusherProps) => {
  const [pusher, setPusher] = useState<Pusher | null>(null);
  const [channel, setChannel] = useState<Pusher.Channel | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize Pusher
    const pusherInstance = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
      authEndpoint: '/api/pusher/auth', // Your Laravel auth endpoint
    });

    pusherInstance.connection.bind('connected', () => {
      setIsConnected(true);
    });

    pusherInstance.connection.bind('disconnected', () => {
      setIsConnected(false);
    });

    setPusher(pusherInstance);

    // Clean up on unmount
    return () => {
      pusherInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!pusher || !channelName) return;

    // Subscribe to channel
    const channelInstance = pusher.subscribe(channelName);
    
    channelInstance.bind('pusher:subscription_succeeded', () => {
      setChannel(channelInstance);
    });

    // Bind to all events (you might want to be more specific in a real app)
    channelInstance.bind('message.sent', (data: any) => {
      onEvent('message.sent', data);
    });

    // Clean up on channel change
    return () => {
      if (channelInstance) {
        pusher.unsubscribe(channelName);
      }
    };
  }, [pusher, channelName, onEvent]);

  return { pusher, channel, isConnected };
};