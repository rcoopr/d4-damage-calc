import clsx from 'clsx';
import { createContext, useContext, useMemo } from 'react';

type SidebarConfig = {
  id: string;
  side: 'left' | 'right';
};
const defaultSidebarConfig: SidebarConfig = {
  id: 'sidebar',
  side: 'right',
};
const SidebarContext = createContext(defaultSidebarConfig);

export function LayoutWithSidebar({
  sidebar,
  handle,
  children,
  ...sidebarConfig
}: {
  sidebar: React.ReactNode;
  handle: React.ReactNode;
  children: React.ReactNode;
} & Partial<SidebarConfig>) {
  const config = useMemo(() => ({ ...defaultSidebarConfig, ...sidebarConfig }), [sidebarConfig]);

  return (
    <SidebarContext.Provider value={config}>
      <div className="flex flex-col overflow-x-auto items-center bg-stone-900 text-stone-300 selection:bg-primary/50 font-sans">
        <Checkbox />
        <div
          className={clsx(
            'transition-transform z-0 ease-out-quart duration-500',
            config.side === 'left' ? 'peer-checked:translate-x-20' : 'peer-checked:-translate-x-20'
          )}
        >
          {children}
        </div>
        <Backdrop />
        <Drawer>
          {sidebar}
          {handle}
        </Drawer>
      </div>
    </SidebarContext.Provider>
  );
}

function Drawer({ children }: { children?: React.ReactNode }) {
  const { side } = useContext(SidebarContext);

  return (
    <aside
      className={clsx(
        'fixed top-0 bottom-0 w-80 border-stone-500 peer-checked:translate-x-0 transition-transform ease-out-quart duration-300',
        side === 'left' ? 'left-0 -translate-x-80 border-r' : 'right-0 translate-x-80 border-l'
      )}
    >
      {children}
    </aside>
  );
}

export function Handle({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const { side } = useContext(SidebarContext);

  return (
    <div
      className={clsx(
        'fixed w-16 top-0 bottom-0',
        side === 'left' ? 'left-full' : 'right-full',
        className
      )}
    >
      {children}
    </div>
  );
}

function Backdrop() {
  const { id } = useContext(SidebarContext);

  return <label htmlFor={id} className="fixed inset-0 bg-stone-950/30 hidden peer-checked:block" />;
}

function Checkbox() {
  const { id } = useContext(SidebarContext);

  return <input id={id} type="checkbox" className="fixed h-0 w-0 appearance-none opacity-0 peer" />;
}

export function Toggle({ className, children }: { className?: string; children: React.ReactNode }) {
  const { id } = useContext(SidebarContext);

  return (
    <label
      htmlFor={id}
      className={clsx(
        'cursor-pointer relative z-10 text-stone-500 hover:text-stone-300',
        className
      )}
    >
      {children}
    </label>
  );
}
