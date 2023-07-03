import { LayoutWithSidebar, SidebarHandle } from './components/sidebar';
import { Homepage } from './sections/main/section';
import { Sidebar } from './sections/main/sidebar';

export default function App() {
  return (
    <div className="flex flex-col overflow-x-auto items-center bg-stone-900 text-stone-300 selection:bg-primary/50 font-sans">
      <LayoutWithSidebar
        id="settings"
        side="right"
        sidebar={<Sidebar />}
        handle={
          <SidebarHandle className="bg-stone-950/80 border-l border-stone-800 justify-end items-center p-4 flex flex-col" />
        }
      >
        <Homepage />
      </LayoutWithSidebar>
    </div>
  );
}
