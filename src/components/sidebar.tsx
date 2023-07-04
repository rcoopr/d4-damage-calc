import clsx from 'clsx';

export const Sidebar = {
  Handle,
  Drawer,
  Checkbox,
  Backdrop,
  Toggle
}

function Handle({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {

  return (
    <div
      className={clsx(
        'fixed w-16 top-0 bottom-0 right-full',
        className
      )}
    >
      {children}
    </div>
  );
}

function Drawer({ children }: { children?: React.ReactNode }) {
  return (
    <aside
      className='fixed top-0 bottom-0 w-80 border-stone-500 peer-checked:translate-x-0 transition-transform ease-out-quart duration-300 right-0 translate-x-80 border-l'
    >
      {children}
    </aside>
  );
}

function Checkbox() {
  return <input id='sidebar' type="checkbox" className="fixed h-0 w-0 appearance-none opacity-0 peer" />;
}

function Backdrop() {
  return <label htmlFor='sidebar' className="fixed inset-0 bg-stone-950/30 hidden peer-checked:block" />;
}

function Toggle({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor='sidebar'
      className={clsx(
        'cursor-pointer relative z-10 text-stone-500 hover:text-stone-300',
        className
      )}
    >
      {children}
    </label>
  );
}
