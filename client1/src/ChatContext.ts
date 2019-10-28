import React, { createContext, useContext } from 'react';
import { SocketService } from './Services/SocketService';

export const ChatContext: React.Context<SocketService> = createContext(new SocketService());

// functional component context hook
export const useChat = () => useContext(ChatContext);
