import { useMutation } from "@tanstack/react-query";
import { postComment } from "@/api/tourPackageData";

export const useMutationTourPackage = () => {
  const postCommentMutation = useMutation({
    mutationFn: postComment,
  });

  return {
    postCommentMutation,
  };
};
