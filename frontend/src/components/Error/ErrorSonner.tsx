import { toast as sonnerToast } from 'sonner';
import { Button } from '../ui/button';

export function toast(toast: Omit<ToastProps, 'id'>) {
  return sonnerToast.custom((id) => {
    return (
      <>
        <Toast
          id={id}
          title={toast.title}
          description={toast.description}
          button={{
            label: toast.button.label,
            onClick: () => console.log('Button clicked'),
          }}
        />
      </>
    );
  });
}


function Toast(props: ToastProps) {
  const { title, description, button, id } = props;

  return (
    <div className='flex items-center gap-2 w-[400px] justify-between bg-[#ffffff] dark:bg-[#09090b] p-6 rounded-xl border-2'>
      <div>
        <p className='text-lg font-semibold'>{title}</p>
        <p className='text-sm'>{description}</p>
      </div>
      <div>
        <Button variant={"outline"} onClick={() => {
            button.onClick();
            sonnerToast.dismiss(id);
          }}>
          {button.label}
        </Button>
      </div>
    </div>
  );
}

interface ToastProps {
  id: string | number;
  title: string;
  description: string;
  button: {
    label: string;
    onClick: () => void;
  };
}