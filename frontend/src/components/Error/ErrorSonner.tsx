import { toast as sonnerToast } from "sonner";
import { Button } from "../ui/button";

export function toast(toast: Omit<ToastProps, "id">) {
  return sonnerToast.custom((id) => {
    return (
      <>
        <Toast
          id={id}
          title={toast.title}
          description={toast.description}
          duration={toast.duration || 1000}
          button={{
            label: toast?.button?.label,
            onClick: () => console.log("Button clicked"),
          }}
        />
      </>
    );
  });
}

function Toast(props: ToastProps) {
  const { title, description, button, id } = props;
  return (
    <div className="flex w-[400px] items-center justify-between gap-2 rounded-xl border-2 bg-[#ffffff] p-6 dark:bg-[#09090b]">
      <div>
        <p className="text-lg font-semibold">{title}</p>
        <p className="text-sm">{description}</p>
      </div>
      {props.button ? (
        <div>
          <Button
            variant={"outline"}
            onClick={() => {
              button?.onClick();
              sonnerToast.dismiss(id);
            }}
          >
            {button?.label}
          </Button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

interface ToastProps {
  id: string | number;
  title: string;
  description: string;
  duration?: number;
  button?: {
    label?: string;
    onClick: () => void;
  };
}
