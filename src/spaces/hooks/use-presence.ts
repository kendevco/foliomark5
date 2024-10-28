import { useEffect } from 'react';
import { useSocket } from './use-socket';

export const usePresence = (userId: string, spaceId: string) => {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket || !userId || !spaceId) return;

    // Join space with online status
    socket.emit('presence:join', {
      userId,
      spaceId,
      status: 'online'
    });

    // Handle window visibility changes
    const handleVisibilityChange = () => {
      const status = document.hidden ? 'idle' : 'online';
      socket.emit('presence:status', {
        userId,
        spaceId,
        status
      });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      socket.emit('presence:leave', { userId, spaceId });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [socket, userId, spaceId]);

  const updateStatus = (status: 'online' | 'offline' | 'idle' | 'dnd') => {
    if (!socket) return;
    socket.emit('presence:status', {
      userId,
      spaceId,
      status
    });
  };

  return { updateStatus };
};
