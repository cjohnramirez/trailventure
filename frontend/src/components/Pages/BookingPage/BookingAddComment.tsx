import { Button } from "@/components/ui/button";
import { useState, Dispatch, SetStateAction, useEffect } from "react";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Rating } from "react-simple-star-rating";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import useConfirmationStore from "@/components/Contexts/ConfirmationStore";
import { useNavigate } from "react-router-dom";
import { Textarea } from "../../ui/textarea";
import { useMutationTourPackage } from "@/hooks/tanstack/tourPackage/useMutationTourPackage";

interface CommentDialogProps {
  commentDialogOpen: boolean;
  setCommentDialogOpen: Dispatch<SetStateAction<boolean>>;
  isAuthorized: boolean;
  isAllowedToComment: boolean;
  transactionId: number;
}

export default function CommentDialog({
  commentDialogOpen,
  setCommentDialogOpen,
  isAuthorized,
  isAllowedToComment,
  transactionId,
}: CommentDialogProps) {
  const [wordCount, setWordCount] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [rating, setRating] = useState(0);
  const [firstPageOpen, setFirstPageOpen] = useState(true);
  const { openConfirmation } = useConfirmationStore();
  const navigate = useNavigate();
  const { postCommentMutation } = useMutationTourPackage();
  const { mutateAsync: mutateCommentData } = postCommentMutation;

  useEffect(() => {
    setFirstPageOpen(false);
  }, []);

  useEffect(() => {
    if (!isAuthorized && !firstPageOpen) {
      openConfirmation({
        title: "Login Required",
        description: "You must login or sign up in order to add a comment",
        cancelLabel: "Cancel",
        actionLabel: "Go to Login",
        onAction: () => {
          navigate("/login");
        },
        onCancel: () => {},
      });
    }
    if (!isAllowedToComment && !firstPageOpen) {
      openConfirmation({
        title: "Not Allowed",
        description: "You must book the package in order to add a comment",
        cancelLabel: "Cancel",
        actionLabel: "Go to Home",
        onAction: () => {
          navigate("/");
        },
        onCancel: () => {},
      });
    }
  }, [commentDialogOpen]);

  const handleCreateComment = async () => {
    const request = await mutateCommentData({
      comment: commentText,
      rating: rating,
      transaction: transactionId,
    });

    if (request.status === 400) {
      openConfirmation({
        title: "Not Allowed",
        description: "You have already reviewed this package",
        cancelLabel: "Cancel",
        actionLabel: "Go to Home",
        onAction: () => {
          navigate("/");
        },
        onCancel: () => {},
      });
    }
    setCommentDialogOpen(false);
  };

  return (
    isAuthorized &&
    isAllowedToComment && (
      <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle asChild>
              <p>Add Review</p>
            </DialogTitle>
            <DialogDescription asChild>
              <p>Write your review about the package</p>
            </DialogDescription>
          </DialogHeader>
          <div>
            <DropdownMenuSeparator className="mb-4" />
            <div className="flex justify-between">
              <p>Comment</p>
              <p className={wordCount >= 254 ? "text-sm text-red-500" : "text-sm"}>
                {wordCount} / 255
              </p>
            </div>
            <Textarea
              placeholder="Enter your comment"
              maxLength={255}
              onChange={(e) => {
                setWordCount(e.target.value.length);
                setCommentText(e.target.value);
              }}
            />
            <DropdownMenuSeparator className="my-4" />
            <div className="flex items-center gap-4">
              <p>Rating</p>
              <Rating
                initialValue={0}
                size={20}
                SVGstyle={{ display: "inline" }}
                allowFraction={true}
                fillColor={"#16baa8"}
                showTooltip={true}
                tooltipStyle={{ fontSize: 14, color: "white" }}
                onClick={(e) => setRating(e)}
              />
            </div>
          </div>
          <DialogFooter>
            <div className="flex w-full justify-between">
              <Button
                type="submit"
                variant={"outline"}
                className="bg-teal-500 text-white dark:text-black"
                onClick={handleCreateComment}
              >
                Submit
              </Button>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant={"outline"}
                  onClick={() => setCommentDialogOpen(false)}
                  className="bg-red-500 text-white dark:text-black"
                >
                  Cancel
                </Button>
              </DialogClose>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  );
}
