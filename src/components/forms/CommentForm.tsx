import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, useToast } from "@/components/ui";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { CommentValidation } from "@/lib/validation";
import { Models } from "appwrite";
import { useCreateComment } from "@/lib/react-query/queries";

type CommentFormProps = {
  comment?: Models.Document;
  postId: string;
  userId: string;
};

const CommentForm = ({ comment, postId, userId }: CommentFormProps) => {
  const { mutateAsync: createComment } = useCreateComment();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      body: comment ? comment.body : "",
    },
  });

  const onSubmit = async (data: z.infer<typeof CommentValidation>) => {
    try {
      const newComment = await createComment({
        ...data,
        postId: postId,
        userId: userId,
      });

      if (newComment) {
        toast({
          title: "Comment created successfully",
        });
        form.setValue("body", "");
      } else {
        toast({
          title: "Failed to create comment, please try again",
        });
      }
    } catch (error) {
      console.error("Error creating comment:", error);
      toast({
        title: "An error occurred, please try again",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Write your comment here"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="shad-button_primary" type="submit">
          Comment
        </Button>
      </form>
    </Form>
  );
};

export default CommentForm;
