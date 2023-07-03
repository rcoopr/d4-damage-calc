import { LayoutWithSidebar } from './components/sidebar';
import { Homepage } from './sections/main/section';
import { Sidebar } from './sections/main/sidebar/sidebar';
import { SidebarHandle } from './sections/main/sidebar-handle';
import { ToastOptions, Toaster, toast } from 'react-hot-toast';

type FullToastOptions = ToastOptions &
  Partial<Record<'success' | 'error' | 'loading' | 'custom', ToastOptions>>;

const toastOptions: FullToastOptions = {
  className: 'px-8',
  success: {
    className: 'py-8',
  },
};

const notify = () => toast.success('A toast message');
export default function App() {
  return (
    <div className="flex flex-col overflow-x-auto items-center bg-stone-900 text-stone-300 selection:bg-primary/50 font-sans">
      <button className="absolute inset-8 w-32 h-8" onClick={notify}>
        toast
      </button>
      <LayoutWithSidebar
        id="settings"
        side="right"
        sidebar={<Sidebar />}
        handle={<SidebarHandle className="bg-stone-950/80 border-l border-stone-800" />}
      >
        <Homepage />
      </LayoutWithSidebar>
      <Toaster position="bottom-left" reverseOrder={false} gutter={8} toastOptions={toastOptions} />
    </div>
  );
}
