import { useMutation } from "@tanstack/react-query";
import { postComment } from "@/api/tourPackageData";

// Post Comment
export const usePostCommentMutation = () =>
  useMutation({
    mutationFn: postComment,
  });
