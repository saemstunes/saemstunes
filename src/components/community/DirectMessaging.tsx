
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Send, PlusCircle, Image, Mic, Smile } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: 'user' | 'other';
}

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    name: 'Sarah Williams',
    avatar: '/placeholder.svg',
    lastMessage: 'How are the violin lessons going?',
    timestamp: '2m ago',
    unread: 3,
  },
  {
    id: '2',
    name: 'Music Mentors',
    avatar: '/placeholder.svg',
    lastMessage: "Don't forget practice tomorrow!",
    timestamp: '1h ago',
    unread: 0,
  },
  {
    id: '3',
    name: 'James Rodriguez',
    avatar: '/placeholder.svg',
    lastMessage: 'I shared a new recording. Check it out!',
    timestamp: '5h ago',
    unread: 1,
  },
  {
    id: '4',
    name: 'Piano Group',
    avatar: '/placeholder.svg',
    lastMessage: 'The next meetup is on Friday',
    timestamp: 'Yesterday',
    unread: 0,
  },
];

const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    text: 'Hi there! How are your violin lessons going?',
    timestamp: '10:32 AM',
    sender: 'other',
  },
  {
    id: '2',
    text: "They're going well! I've been practicing daily.",
    timestamp: '10:35 AM',
    sender: 'user',
  },
  {
    id: '3',
    text: 'That's great to hear! Have you learned any new pieces recently?',
    timestamp: '10:36 AM',
    sender: 'other',
  },
  {
    id: '4',
    text: 'Yes! I'm working on a Bach partita. It's challenging but fun!',
    timestamp: '10:40 AM',
    sender: 'user',
  },
  {
    id: '5',
    text: 'Bach is always challenging! Would you like to share a recording next time? I'd love to listen and provide feedback.',
    timestamp: '10:42 AM',
    sender: 'other',
  },
];

const DirectMessaging = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(MOCK_CONVERSATIONS[0]);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const newMsg: Message = {
      id: Date.now().toString(),
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'user',
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
    
    // Simulate reply after a delay
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for sharing that! How about we schedule a practice session next week?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'other',
      };
      setMessages(prev => [...prev, response]);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[600px] md:max-h-[600px]">
      <div className="flex h-full">
        {/* Conversations sidebar */}
        <div className="hidden md:flex md:w-80 flex-col border-r border-border">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search messages" 
                className="pl-9"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {MOCK_CONVERSATIONS.map(conversation => (
              <button 
                key={conversation.id}
                className={cn(
                  "w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/50 text-left",
                  selectedConversation?.id === conversation.id && "bg-muted"
                )}
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={conversation.avatar} alt={conversation.name} />
                    <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {conversation.unread > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold rounded-full text-[10px] flex items-center justify-center text-white">
                      {conversation.unread}
                    </span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="font-medium truncate">{conversation.name}</p>
                    <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                </div>
              </button>
            ))}
          </div>
          
          <div className="p-4 border-t border-border">
            <Button className="w-full">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Message
            </Button>
          </div>
        </div>
        
        {/* Message view */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Conversation header */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.name} />
                    <AvatarFallback>{selectedConversation.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedConversation.name}</p>
                    <p className="text-xs text-muted-foreground">Online now</p>
                  </div>
                </div>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(message => (
                  <div 
                    key={message.id}
                    className={cn(
                      "flex",
                      message.sender === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    <div 
                      className={cn(
                        "max-w-[80%] rounded-lg px-4 py-2 text-sm",
                        message.sender === 'user' 
                          ? "bg-gold text-primary-foreground rounded-br-none"
                          : "bg-muted rounded-bl-none"
                      )}
                    >
                      <p>{message.text}</p>
                      <p className={cn(
                        "text-[10px] mt-1",
                        message.sender === 'user' ? "text-primary-foreground/80" : "text-muted-foreground"
                      )}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Message input */}
              <div className="p-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <PlusCircle className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => toast({
                      title: "Feature coming soon",
                      description: "Image sharing will be available soon!"
                    })}
                  >
                    <Image className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => toast({
                      title: "Feature coming soon",
                      description: "Audio message recording will be available soon!"
                    })}
                  >
                    <Mic className="h-5 w-5" />
                  </Button>
                  
                  <Input 
                    placeholder="Type a message..." 
                    className="flex-1"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => toast({
                      title: "Feature coming soon",
                      description: "Emoji picker will be available soon!"
                    })}
                  >
                    <Smile className="h-5 w-5" />
                  </Button>
                  
                  <Button 
                    size="icon" 
                    className={cn(
                      "h-8 w-8 bg-gold hover:bg-gold/90 text-white",
                      !newMessage.trim() && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={!newMessage.trim()}
                    onClick={handleSendMessage}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground">Select a conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DirectMessaging;
