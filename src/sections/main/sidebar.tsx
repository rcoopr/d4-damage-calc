import clsx from 'clsx';
import { stats } from '../../store/builds/stats/labels';

export function Sidebar() {
  return (
    <div className="absolute inset-0 flex flex-col p-8 bg-stone-950/90">
      <h3 className="uppercase text-stone-400 text-lg self-center mb-6 font-bold tracking-widest">
        Settings
      </h3>
      <ul>
        <li>
          <p className="uppercase text-stone-500 font-bold tracking-wide mb-2">Sliders</p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
            {stats.map((stat) => (
              <li key={stat.id} className="relative">
                <input
                  id={`setting-slider-${stat.id}`}
                  type="checkbox"
                  className="fixed inset-0 h-0 w-0 appearance-none opacity-0 peer"
                />
                <label
                  htmlFor={`setting-slider-${stat.id}`}
                  className="flex flex-col px-2 py-1 border-2 peer-checked:border-orange-400 rounded-lg"
                >
                  <p className="self-center">{stat.label}</p>
                  <div className="flex items-center">
                    <p>Min</p>
                    <input
                      type="number"
                      min="0"
                      className={clsx(
                        'border w-16 rounded-md block px-1.5 py-0.5 pl-8 placeholder-stone-400 text-stone-100 outline-none focus:ring-2',
                        // error
                        //   ? 'focus:ring-error focus:border-error border-error bg-error-content selection:bg-error/50'
                        'focus:ring-primary focus:border-primary border-stone-600 bg-stone-700'
                      )}
                    />
                  </div>
                  <div className="flex items-center">
                    <p>Max</p>
                    <input
                      type="number"
                      min="0"
                      className={clsx(
                        'border w-16 rounded-md block px-1.5 py-0.5 pl-8 placeholder-stone-400 text-stone-100 outline-none focus:ring-2',
                        // error
                        //   ? 'focus:ring-error focus:border-error border-error bg-error-content selection:bg-error/50'
                        'focus:ring-primary focus:border-primary border-stone-600 bg-stone-700'
                      )}
                    />
                  </div>
                </label>
              </li>
            ))}
          </ul>
        </li>
        <li>
          <a>Sidebar Item 2</a>
        </li>
      </ul>
    </div>
  );
}
