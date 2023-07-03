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

export function SidebarHandle({ className }: { className?: string }) {
  return (
    <Handle className={className}>
      <Toggle />
    </Handle>
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

function Handle({ className, children }: { className?: string; children?: React.ReactNode }) {
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

function Toggle() {
  const { id } = useContext(SidebarContext);

  return (
    <label
      htmlFor={id}
      className="cursor-pointer relative z-10 text-stone-500 hover:text-stone-300"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 24 24">
        <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
          <path d="M12 8.25a3.75 3.75 0 1 0 0 7.5a3.75 3.75 0 0 0 0-7.5ZM9.75 12a2.25 2.25 0 1 1 4.5 0a2.25 2.25 0 0 1-4.5 0Z"></path>
          <path d="M11.975 1.25c-.445 0-.816 0-1.12.02a2.823 2.823 0 0 0-.907.19a2.75 2.75 0 0 0-1.489 1.488c-.145.35-.184.72-.2 1.122a.868.868 0 0 1-.415.731a.868.868 0 0 1-.841-.005c-.356-.188-.696-.339-1.072-.389a2.75 2.75 0 0 0-2.033.545a2.83 2.83 0 0 0-.617.691c-.17.254-.356.575-.578.96l-.025.044c-.223.385-.408.706-.542.98c-.14.286-.25.568-.29.88a2.75 2.75 0 0 0 .544 2.033c.231.301.532.52.872.734a.868.868 0 0 1 .426.726a.868.868 0 0 1-.426.726c-.34.214-.64.433-.872.734a2.75 2.75 0 0 0-.545 2.033c.041.312.15.594.29.88c.135.274.32.595.543.98l.025.044c.222.385.408.706.578.96c.177.263.367.5.617.69a2.75 2.75 0 0 0 2.033.546c.376-.05.716-.2 1.072-.389a.867.867 0 0 1 .84-.005a.863.863 0 0 1 .417.731c.015.402.054.772.2 1.122a2.75 2.75 0 0 0 1.488 1.489c.29.12.59.167.907.188c.304.021.675.021 1.12.021h.05c.445 0 .816 0 1.12-.02c.318-.022.617-.069.907-.19a2.75 2.75 0 0 0 1.489-1.488c.145-.35.184-.72.2-1.122a.868.868 0 0 1 .415-.732a.868.868 0 0 1 .841.006c.356.188.696.339 1.072.388a2.75 2.75 0 0 0 2.033-.544c.25-.192.44-.428.617-.691c.17-.254.356-.575.578-.96l.025-.044c.223-.385.408-.706.542-.98c.14-.286.25-.569.29-.88a2.75 2.75 0 0 0-.544-2.033c-.231-.301-.532-.52-.872-.734a.868.868 0 0 1-.426-.726c0-.278.152-.554.426-.726c.34-.214.64-.433.872-.734a2.75 2.75 0 0 0 .545-2.033a2.826 2.826 0 0 0-.29-.88a17.9 17.9 0 0 0-.543-.98l-.025-.044a18.028 18.028 0 0 0-.578-.96a2.823 2.823 0 0 0-.617-.69a2.75 2.75 0 0 0-2.033-.546c-.376.05-.716.2-1.072.389a.868.868 0 0 1-.84.005a.868.868 0 0 1-.417-.731c-.015-.402-.054-.772-.2-1.122a2.75 2.75 0 0 0-1.488-1.489c-.29-.12-.59-.167-.907-.188c-.304-.021-.675-.021-1.12-.021h-.05Zm-1.453 1.595c.077-.032.194-.061.435-.078c.247-.017.567-.017 1.043-.017s.796 0 1.043.017c.241.017.358.046.435.078c.307.127.55.37.677.677c.04.096.073.247.086.604c.03.792.439 1.555 1.165 1.974c.726.42 1.591.392 2.292.022c.316-.167.463-.214.567-.227a1.25 1.25 0 0 1 .924.247c.066.051.15.138.285.338c.139.206.299.483.537.895c.238.412.397.69.506.912c.107.217.14.333.15.416a1.25 1.25 0 0 1-.247.924c-.064.083-.178.187-.48.377c-.672.422-1.128 1.158-1.128 1.996c0 .838.456 1.574 1.128 1.996c.302.19.416.294.48.377c.202.263.29.595.247.924c-.01.083-.044.2-.15.416c-.109.223-.268.5-.506.912c-.238.412-.399.689-.537.895c-.135.2-.219.287-.285.338a1.25 1.25 0 0 1-.924.247c-.104-.013-.25-.06-.567-.227c-.7-.37-1.566-.398-2.292.021c-.726.42-1.135 1.183-1.165 1.975c-.013.357-.046.508-.086.604a1.25 1.25 0 0 1-.677.677c-.077.032-.194.061-.435.078c-.247.017-.567.017-1.043.017s-.796 0-1.043-.017c-.241-.017-.358-.046-.435-.078a1.25 1.25 0 0 1-.677-.677c-.04-.096-.073-.247-.086-.604c-.03-.792-.439-1.555-1.165-1.974c-.726-.42-1.591-.392-2.292-.022c-.316.167-.463.214-.567.227a1.25 1.25 0 0 1-.924-.247c-.066-.051-.15-.138-.285-.338a17.055 17.055 0 0 1-.537-.895c-.238-.412-.397-.69-.506-.912c-.107-.217-.14-.333-.15-.416a1.25 1.25 0 0 1 .247-.924c.064-.083.178-.187.48-.377c.672-.422 1.128-1.158 1.128-1.996c0-.838-.456-1.574-1.128-1.996c-.302-.19-.416-.294-.48-.377a1.25 1.25 0 0 1-.247-.924c.01-.083.044-.2.15-.416c.109-.223.268-.5.506-.912c.238-.412.399-.689.537-.895c.135-.2.219-.287.285-.338a1.25 1.25 0 0 1 .924-.247c.104.013.25.06.567.227c.7.37 1.566.398 2.292-.022c.726-.419 1.135-1.182 1.165-1.974c.013-.357.046-.508.086-.604c.127-.307.37-.55.677-.677Z"></path>
        </g>
      </svg>
    </label>
  );
}
