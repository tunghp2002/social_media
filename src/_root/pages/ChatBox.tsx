import { useMemo, useState, useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import {
  useGetUsers,
  useCreateNewChat,
  useGetChats,
  useGetMessagesChatId,
  useCreateMessages,
} from "@/lib/react-query/queries";
import { Loader, ChatCard } from "@/components/shared";
import { MessagesValidation } from "@/lib/validation";
import { useUserContext } from "@/context/AuthContext";
const ChatBox = () => {
  const form = useForm<z.infer<typeof MessagesValidation>>({
    resolver: zodResolver(MessagesValidation),
    defaultValues: {
      content: "",
    },
  });
  const { user } = useUserContext();
  const { data: creators, isLoading: isUserLoading } = useGetUsers(10);
  const { data: chat, isLoading, isError } = useGetChats();
  const createNewChatMutation = useCreateNewChat();

  const [chatId, setChatId] = useState<string | null>(null);
  const { data: messages, isLoading: isMessageLoading } =
    useGetMessagesChatId(chatId);
  const createMessagesMutation = useCreateMessages();
  const contentRef = useRef(null);

  function onSubmit(data: z.infer<typeof MessagesValidation>) {
    if (!chatId) {
      toast({
        title: "Please select a chat",
      });
      return;
    }
    createMessagesMutation.mutate({
      chatId,
      userId: user.id,
      content: data.content,
    });
    form.setValue("content", "");
  }

  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      contentRef.current.scrollTop = contentHeight;
    }
  }, [messages]);

  const handleChatCardClick = async (id: string) => {
    if (!id) return;
    for (const chatItem of chat?.documents ?? []) {
      const participantIds =
        chatItem?.participants?.map((participant: any) => participant.$id) ??
        [];
      if (participantIds.includes(user.id) && participantIds.includes(id)) {
        toast({
          title: "Opening box chat",
        });
        setChatId(chatItem.$id);
        return;
      }
    }
    const newChat = await createNewChatMutation.mutateAsync([user.id, id]);
    if (newChat) {
      toast({
        title: "New chat created",
      });
      setChatId(newChat.$id);
    } else {
      toast({
        title: "Failed to create new chat",
      });
    }
  };

  const filteredCreators = useMemo(() => {
    if (!creators) return [];
    return creators.documents.filter((creator) => creator?.$id !== user?.id);
  }, [creators, user]);

  return (
    <div className="flex flex-1">
      <div className="chat-friends ">
        <h3 className="h3-bold text-light-1">Let's chat</h3>
        {isUserLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="grid gap-6">
            {filteredCreators.map((creator) => (
              <li key={creator?.$id}>
                <ChatCard
                  user={creator}
                  onClick={() => handleChatCardClick(creator.$id)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex flex-col flex-1 gap-10 py-10 px-5 md:px-8 lg:p-14 relative">
        <div
          ref={contentRef}
          className="z-10 overflow-y-auto custom-scrollbar h-full mb-14">
          {isMessageLoading && !messages ? (
            <Loader />
          ) : (
            <div>
              {messages?.documents
                .slice()
                .reverse()
                .map((message) => (
                  <div key={message.$id} className="message ">
                    <div className="text-center">{message.$createdAt}</div>
                    <div
                      className={`flex flex-1 ${
                        message.sender.$id === user.id
                          ? "justify-end"
                          : "justify-start"
                      } rounded-full px-4 h-10 text-lg items-center my-3 bg-auto px-20`}>
                      <span
                        className={`${
                          message.sender.$id === user.id
                            ? "bg-orange-400"
                            : "bg-orange-100 text-slate-950"
                        } rounded-full px-5 py-1`}>
                        {message.content}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
        <Form {...form}>
          {!isMessageLoading && messages && (
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex w-5/6 items-end min-h-full mt-10 absolute bottom-5 ">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="flex flex-1 gap-5 items-end ">
                    <FormControl>
                      <Input placeholder="Aa" {...field} />
                    </FormControl>
                    <FormMessage />
                    <Button
                      className="bg-orange-500 hover:bg-orange-300"
                      type="submit">
                      Send
                    </Button>
                  </FormItem>
                )}
              />
            </form>
          )}
        </Form>
      </div>
    </div>
  );
};

export default ChatBox;
