import { useCallback, useState } from 'react';
import { buildNamesAtom } from '../../../store/builds/builds';
import { useAtomValue } from 'jotai';
import { SaveBuildForm } from './builds/forms/new';
import { BuildNameInputForm } from './builds/forms/rename';

export function Sidebar() {
  return (
    <aside className="absolute inset-0 flex flex-col p-8 pt-5 bg-stone-950/90">
      <SidebarSection title="Builds" startOpen>
        <BuildList />
        <SaveBuildForm />
      </SidebarSection>
    </aside>
  );
}

function SidebarSection({
  title,
  children,
  startOpen,
}: {
  title: string;
  children: React.ReactNode;
  startOpen?: boolean;
}) {
  const [open, setOpen] = useState(startOpen ?? false);
  const toggle = useCallback(() => setOpen((o) => !o), [setOpen]);

  return (
    <>
      <section className="group" data-open={open}>
        <div
          role="button"
          onClick={toggle}
          className="flex items-center justify-between text-lg hover:bg-stone-900 -mx-3 px-3 py-1.5 my-1.5 rounded-md"
        >
          <h3 className="uppercase text-stone-400 font-bold tracking-widest">{title}</h3>
          <div className='i-solar-alt-arrow-down-linear transition-transform -rotate-90 group-data-[open="true"]:rotate-0'></div>
        </div>
        <div className='auto-height group-data-[open="true"]:auto-height-open -mx-1'>
          <div className="px-1">{children}</div>
        </div>
      </section>
      <div className="divider my-0 last:hidden" />
    </>
  );
}

function BuildList() {
  const names = useAtomValue(buildNamesAtom);

  return (
    <ul className="mb-4 flex flex-col">
      {names.map((name) => (
        <li key={name}>
          <BuildNameInputForm name={name} />
        </li>
      ))}
    </ul>
  );
}

// function Settings() {
//   <>
//     <h3 className="uppercase text-stone-400 text-lg self-center mb-3 font-bold tracking-widest">
//       Settings
//     </h3>
//     <ul>
//       <li>
//         <p className="uppercase text-stone-500 font-bold tracking-wide mb-2">Sliders</p>
//         <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
//           {stats.map((stat) => (
//             <li key={stat.id} className="relative">
//               <input
//                 id={`setting-slider-${stat.id}`}
//                 type="checkbox"
//                 className="fixed inset-0 h-0 w-0 appearance-none opacity-0 peer"
//               />
//               <label
//                 htmlFor={`setting-slider-${stat.id}`}
//                 className="flex flex-col px-2 py-1 border-2 peer-checked:border-orange-400 rounded-lg"
//               >
//                 <p className="self-center">{stat.label}</p>
//                 <div className="flex items-center">
//                   <p>Min</p>
//                   <input
//                     type="number"
//                     min="0"
//                     className={clsx(
//                       'border w-16 rounded-md block px-1.5 py-0.5 pl-8 placeholder-stone-400 text-stone-100 outline-none focus:ring-2',
//                       // error
//                       //   ? 'focus:ring-error focus:border-error border-error bg-error-content selection:bg-error/50'
//                       'focus:ring-primary focus:border-primary border-stone-600 bg-stone-700'
//                     )}
//                   />
//                 </div>
//                 <div className="flex items-center">
//                   <p>Max</p>
//                   <input
//                     type="number"
//                     min="0"
//                     className={clsx(
//                       'border w-16 rounded-md block px-1.5 py-0.5 pl-8 placeholder-stone-400 text-stone-100 outline-none focus:ring-2',
//                       // error
//                       //   ? 'focus:ring-error focus:border-error border-error bg-error-content selection:bg-error/50'
//                       'focus:ring-primary focus:border-primary border-stone-600 bg-stone-700'
//                     )}
//                   />
//                 </div>
//               </label>
//             </li>
//           ))}
//         </ul>
//       </li>
//     </ul>
//   </>;
// }
