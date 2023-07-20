import { DpsStats } from '@/lib/store/builds/schema'

export type Affix = {
	name: string
	label: string | ((roll: number) => string)
	eff: number
	range: [number, number]
	bucket?: { stat: keyof DpsStats; value: (roll: number) => number }
}

type Weapon = {
	id: string
	label: string
	inherent: { affix: Affix; efficiency: number }
	slots: 1 | 2
}

export type WeaponId = keyof typeof weapons

const charClasses = ['barb', 'druid', 'necro', 'rogue', 'sorc'] as const
export type CharClass = (typeof charClasses)[number]

export function isCharClass(maybeClass: string): maybeClass is CharClass {
	return charClasses.includes(maybeClass as CharClass)
}

export function isItem(maybeItem: string): maybeItem is WeaponId {
	return maybeItem in weapons
}

// prettier-ignore
const affixes = {
  shared: {
    overpowerDmg:         { name: 'Demolition',       eff: 1, range: [21.0, 42.0], label: r => `+${r}% Overpower Damage` },
    vuln:                 { name: 'Cruel',            eff: 0.60, range: [16.5, 23.5], bucket: {stat: 'vulnerable', value: r => r}, label: r => `+${r}% Vulnerable Damage` },
    critDmg:              { name: 'Focused',          eff: 0.83, range: [14.0, 21.0], bucket: {stat: 'critDamage', value: r => r}, label: r => `+${r}% Critical Strike Damage` },
    
    dmgStunned:           { name: 'Imposing',         eff: 1, range: [16.5, 23.5], bucket: {stat: 'additive', value: r => r}, label: r => `+${r}% Damage to Stunned Enemies` },
    dmgSlowed:            { name: 'Poacher',          eff: 1, range: [16.5, 23.5], bucket: {stat: 'additive', value: r => r}, label: r => `+${r}% Damage to Slowed Enemies` },
    dmgDistant:           { name: 'Reaching',         eff: 1, range: [16.5, 23.5], bucket: {stat: 'additive', value: r => r}, label: r => `+${r}% Damage to Distant Enemies` },
    dmgClose:             { name: 'Riposting',        eff: 1, range: [16.5, 23.5], bucket: {stat: 'additive', value: r => r}, label: r => `+${r}% Damage to Close Enemies` },
    
    dmgInjured:           { name: 'Guillotine',       eff: 1, range: [21.0, 35.0], bucket: {stat: 'additive', value: r => r}, label: r => `+${r}% Damage to Injured Enemies` },
    dmgCCed:              { name: 'Punishing',        eff: 0.7, range: [9.50, 16.5], bucket: {stat: 'additive', value: r => r}, label: r => `+${r}% Damage to Crowd Controlled Enemies` },
    dmgDot:               { name: 'Lingering',        eff: 1, range: [7.00, 14.0], bucket: {stat: 'additive', value: r => r}, label: r => `+${r}% Damage Over Time` },
    
    dmgBasic:             { name: 'Fundamental',      eff: 1, range: [18.5, 39.5], bucket: {stat: 'additive', value: r => r}, label: r => `+${r}% Basic Skill Damage` },
    dmgCore:              { name: 'Brutal',           eff: 1, range: [12.5, 19.5], bucket: {stat: 'additive', value: r => r}, label: r => `+${r}% Core Skill Damage` },
    dmgUlt:               { name: 'Pinnacle',         eff: 1, range: [14.0, 21.0], bucket: {stat: 'additive', value: r => r}, label: r => `+${r}% Ultimate Skill Damage` },
    
    execute:              { name: 'Executing',        eff: 1, range: [4.40, 10.0], label: r => `+${r}% Lucky hit: Chance to Execute Injured Non-Elites` },
    
    allStat:              { name: 'Harmonious',       eff: 1, range: [20.0, 28.0], bucket: {stat: 'mainStat', value: r => r}, label: r => `+${r} All Stats` },
  },

  mainstat: {
    dex:                  { name: 'Adroit',           eff: 5 / 6, range: [49.0, 63.0], bucket: {stat: 'mainStat', value: r => r}, label: r => `+${r} Dexterity` },
    str:                  { name: 'Powerful',         eff: 5 / 6, range: [49.0, 63.0], bucket: {stat: 'mainStat', value: r => r}, label: r => `+${r} Strength` },
    int:                  { name: 'Wise',             eff: 5 / 6, range: [49.0, 63.0], bucket: {stat: 'mainStat', value: r => r}, label: r => `+${r} Intelligence` },
    will:                 { name: 'Determined',       eff: 5 / 6, range: [49.0, 63.0], bucket: {stat: 'mainStat', value: r => r}, label: r => `+${r} Willpower` },
  },

  status: {
    dmgPoison:            { name: 'Festering',        eff: 1, range: [7.00, 14.0], bucket: {stat: 'additive', value: r => r}, label: r => `+${r}% Damage to Poisoned Enemies` },
    dmgChilled:           { name: 'Gelid',            eff: 1, range: [7.00, 14.0], bucket: {stat: 'additive', value: r => r}, label: r => `+${r}% Damage to Chilled Enemies` },
    dmgFrozen:            { name: 'Glacial',          eff: 1.2, range: [7.00, 14.0], bucket: {stat: 'additive', value: r => r}, label: r => `+${r}% Damage to Frozen Enemies` },
    dmgBurning:           { name: 'Conflagrating',    eff: 1, range: [7.00, 14.0], bucket: {stat: 'additive', value: r => r}, label: r => `+${r}% Damage to Burning Enemies` },
  },

  barb: {
    dmgBleed:             { name: 'Execution',        eff: 1, range: [7.00, 14.0], bucket: {stat: 'additive', value: r => r}, label: r => `+${r}% Damage to Bleeding Enemies` },
    dmgBerserking:        { name: 'Vehement',         eff: 1, range: [7.00, 14.0], bucket: {stat: 'additive', value: r => r}, label: r => `+${r}% Damage while Berserking` },
  },
  druid: {
    critDmgLightning:     { name: 'Precision',        eff: 0.83, range: [14.0, 21.0], bucket: {stat: 'critDamage', value: r => r}, label: r => `+${r}% Lightning Critical Strike Damage` },
    critDmgWerewolf:      { name: 'Claw Sharpening',  eff: 0.83, range: [14.0, 21.0], bucket: {stat: 'critDamage', value: r => r}, label: r => `+${r}% Critical Strike Damage with Werewolf Skills` },
    overpowerDmgWerebear: { name: 'Hide Bolstering',  eff: 1, range: [28.0, 42.0], label: r => `+${r}% Overpower Damage with Werebear Skills` },
    critDmgEarth:         { name: 'Land Sundering',   eff: 0.83, range: [14.0, 21.0], label: r => `+${r}% Critical Strike Damage with Earth Skills` },
  },
  necro: {
    critDmgBone:          { name: `Joint Splitter's`, eff: 0.83, range: [14.0, 21.0], label: r => `+${r}% Critical Strike Damage with Bone Skills` },
    dmgShadowed:          { name: 'Festering',        eff: 1, range: [7.00, 14.0], bucket: {stat: 'additive', value: r => r}, label: r => `+${r}% Damage to Affected by Shadow Damage Over Time Enemies` },
  },
  rogue: {
    dmgTrapped:           { name: 'Advantageous',     eff: 1, range: [7.00, 14.0], bucket: {stat: 'additive', value: r => r}, label: r => `+${r}% Damage to Enemies Affected by Trap Skills` },
    dmgDazed:             { name: 'Startling',        eff: 1, range: [16.5, 23.5], bucket: {stat: 'additive', value: r => r}, label: r => `+${r}% Damage to Dazed Enemies` },
    critDmgImbued:        { name: 'Caustic',          eff: 0.83, range: [14.0, 21.0], bucket: {stat: 'critDamage', value: r => r}, label: r => `+${r}% Critical Strike Damage with Imbued Skills` },
  },
  sorc: {
  },

  weapons: {
    dmgHealthy:           {name: `Opportunist's`,     eff: 1, range: [21.0, 35.0], bucket: {stat: 'additive', value: r => r}, label: r => `+${r}% Damage to Healthy Enemies` },
    lucky:                {name: 'Lucky',             eff: 1, range: [4.40, 10.0], label: r => `+${r}% Lucky Hit Chance` },
    lifeOnKill:           {name: 'Harvesting',        eff: 1, range: [101.5, 101.5], label: r => `+${r}% Life On Kill` },
  }
} satisfies Record<string, Record<string,  Affix>>

const sharedAffixes = Object.values(affixes.shared)

const classAffixes = {
	barb: [
		...sharedAffixes,
		...Object.values(affixes.barb),
		affixes.mainstat.str,
	],

	druid: [
		...sharedAffixes,
		...Object.values(affixes.druid),
		affixes.status.dmgPoison,
		affixes.mainstat.will,
	],

	necro: [
		...sharedAffixes,
		...Object.values(affixes.necro),
		affixes.mainstat.int,
	],

	rogue: [
		...sharedAffixes,
		...Object.values(affixes.rogue),
		affixes.status.dmgPoison,
		affixes.status.dmgChilled,
		affixes.status.dmgFrozen,
		affixes.mainstat.dex,
	],

	sorc: [
		...sharedAffixes,
		// ...Object.values(affixes.sorc), // nothing here yet
		affixes.status.dmgChilled,
		affixes.status.dmgFrozen,
		affixes.status.dmgBurning,
		affixes.mainstat.int,
	],
} satisfies Record<CharClass, Affix[]>

export const weapons = {
	axe: {
		id: 'axe',
		label: 'Axe',
		inherent: { affix: affixes.weapons.dmgHealthy, efficiency: 4 / 5 },
		slots: 1,
	},
	axe2h: {
		id: 'axe2h',
		label: 'Axe (2H)',
		inherent: { affix: affixes.weapons.dmgHealthy, efficiency: 4 / 5 },
		slots: 2,
	},
	mace: {
		id: 'mace',
		label: 'Mace',
		inherent: { affix: affixes.shared.overpowerDmg, efficiency: 3 / 4 },
		slots: 1,
	},
	mace2h: {
		id: 'mace2h',
		label: 'Mace (2H)',
		inherent: { affix: affixes.shared.overpowerDmg, efficiency: 3 / 4 },
		slots: 2,
	},
	sword: {
		id: 'sword',
		label: 'Sword',
		inherent: {
			affix: affixes.shared.critDmg,
			efficiency: ((35 / 42) * 1) / 2,
		},
		slots: 1,
	},
	sword2h: {
		id: 'sword2h',
		label: 'Sword (2H)',
		inherent: {
			affix: affixes.shared.critDmg,
			efficiency: ((35 / 42) * 1) / 2,
		},
		slots: 2,
	},
	polearm: {
		id: 'polearm',
		label: 'Polearm',
		inherent: { affix: affixes.shared.dmgInjured, efficiency: 4 / 5 },
		slots: 2,
	},
	staff: {
		id: 'staff',
		label: 'Staff',
		inherent: { affix: affixes.shared.dmgCCed, efficiency: 35 / 33 },
		slots: 1,
	},
	dagger: {
		id: 'dagger',
		label: 'Dagger',
		inherent: { affix: affixes.shared.dmgClose, efficiency: 40 / 47 },
		slots: 1,
	},
	scythe: {
		id: 'scythe',
		label: 'Scythe',
		inherent: { affix: affixes.shared.critDmg, efficiency: 35 / 42 },
		slots: 1,
	},
	scythe2h: {
		id: 'scythe2h',
		label: 'Scythe (2H)',
		inherent: { affix: affixes.shared.critDmg, efficiency: 35 / 42 },
		slots: 2,
	},
	wand: {
		id: 'wand',
		label: 'Wand',
		inherent: { affix: affixes.weapons.lucky, efficiency: 1 },
		slots: 1,
	},
	xbow: {
		id: 'xbow',
		label: 'Crossbow',
		inherent: {
			affix: affixes.shared.vuln,
			efficiency: 40 / 47,
		},
		slots: 2,
	},
	bow: {
		id: 'bow',
		label: 'Bow',
		inherent: { affix: affixes.shared.dmgDistant, efficiency: 40 / 47 },
		slots: 2,
	},
} satisfies Record<string, Weapon>

const barbWeapons: Weapon[] = [
	weapons.axe,
	weapons.axe2h,
	weapons.mace,
	weapons.mace2h,
	weapons.sword,
	weapons.sword2h,
	weapons.polearm,
]

const druidWeapons: Weapon[] = [
	weapons.axe,
	weapons.axe2h,
	weapons.mace,
	weapons.mace2h,
	weapons.staff,
]

const necroWeapons: Weapon[] = [
	weapons.dagger,
	weapons.scythe,
	weapons.scythe2h,
	weapons.sword,
	weapons.sword2h,
	weapons.wand,
]

const rogueWeapons: Weapon[] = [
	weapons.xbow,
	weapons.bow,
	weapons.dagger,
	weapons.sword,
]

const sorcWeapons: Weapon[] = [weapons.staff, weapons.wand]

export const charClassData = {
	barb: {
		label: 'Barbarian',
		icon: 'i-solar-shield-broken',
		items: {
			weapons: {
				affixes: classAffixes.barb,
				kinds: barbWeapons,
			},
		},
	},

	druid: {
		label: 'Druid',
		icon: 'i-solar-cloud-storm-bold',
		items: {
			weapons: {
				affixes: classAffixes.druid,
				kinds: druidWeapons,
			},
		},
	},

	necro: {
		label: 'Necromancer',
		icon: 'i-solar-people-nearby-linear',
		items: {
			weapons: {
				affixes: classAffixes.necro,
				kinds: necroWeapons,
			},
		},
	},

	rogue: {
		label: 'Rogue',
		icon: 'i-solar-alt-arrow-up-bold-duotone',
		items: {
			weapons: {
				affixes: classAffixes.rogue,
				kinds: rogueWeapons,
			},
		},
	},

	sorc: {
		label: 'Sorceror',
		icon: 'i-solar-star-fall-bold',
		items: {
			weapons: {
				affixes: classAffixes.sorc,
				kinds: sorcWeapons,
			},
		},
	},
}
