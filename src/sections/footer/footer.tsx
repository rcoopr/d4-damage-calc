export function Footer() {
  return (
    <footer className="px-8 md:px-16 lg:px-24 pb-12">
      <p className="mb-8">
        Unfortunately, some in-game info is bugged, and may display extra damage on the character
        stats tab when they shouldn't. <br />
        This includes <span className="font-bold text-stone-300">Aspect of Control </span> and
        <span className="font-bold text-stone-300"> Aspect of Retribution</span>.
        <span className="font-bold text-stone-300"> +Elemental Damage </span>
        also doesn't display correctly in combination with{' '}
        <span className="font-bold text-stone-300"> +Non-Physical Damage </span>
      </p>
      <p className="text-stone-200 text-sm mb-8">
        Note: Because of how the game treats weapon speed and weapon DPS, the{' '}
        <span className="italic font-mono">true</span> DPS may be innacurate, however for comparison
        purposes it doesn't make any difference
      </p>
      <div className="flex justify-end">
        <a
          className="link rounded-lg bg-secondary hover:bg-secondary-focus text-secondary-content font-semibold items-center p-2.5"
          href="https://www.buymeacoffee.com/rcoopr"
        >
          Support my work
        </a>
      </div>
    </footer>
  );
}
