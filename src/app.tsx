import { Homepage } from './sections/main/section';

export default function App() {
  return (
    <div className="flex flex-col overflow-x-auto items-center bg-stone-900 text-stone-300 selection:bg-primary/50 font-sans">
      {/* <LayoutWithSidebar content={<Homepage />}>
        <Sidebar />
      </LayoutWithSidebar> */}
      <Homepage />
    </div>
  );
}
