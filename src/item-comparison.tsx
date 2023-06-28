import { StatInput } from './stat-input';

export function ItemComparison() {
  // const { item, setItem } = useItemSelection();
  // const onItem1Select = useCallback<ChangeEventHandler<HTMLInputElement>>(
  //   (ev) => {
  //     if (ev.currentTarget.checked) setItem(1);
  //   },
  //   [setItem]
  // );
  // const onItem2Select = useCallback<ChangeEventHandler<HTMLInputElement>>(
  //   (ev) => {
  //     if (ev.currentTarget.checked) setItem(2);
  //   },
  //   [setItem]
  // );

  return (
    <div className="grid lg:grid-rows-[repeat(7,_auto)] lg:grid-cols-2 lg:grid-flow-col gap-x-12 gap-y-2 relative">
      {/* <label htmlFor="item-1-select" className="flex ml-auto pl-4 gap-4 cursor-pointer"> */}
      <h3 className="text-lg italic text-stone-400">Item 1</h3>
      {/* <input
          id="item-1-select"
          type="radio"
          checked={item === 1}
          onChange={onItem1Select}
          name="item-select"
          className="cursor-pointer"
        /> */}
      {/* </label> */}
      <StatInput name="item1" />
      {/* <label
        htmlFor="item-2-select"
        className="flex max-md:ml-auto md:mr-auto max-md:pl-4 md:pr-4 gap-4 cursor-pointer flex-row-reverse"
      > */}
      <h3 className="text-lg italic text-stone-400">Item 2</h3>
      {/* <input
          id="item-2-select"
          type="radio"
          checked={item === 2}
          onChange={onItem2Select}
          name="item-select"
          className="cursor-pointer"
        /> */}
      {/* </label> */}
      <StatInput name="item2" />
    </div>
  );
}
