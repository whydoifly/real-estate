import Link from 'next/link';

export default function About() {
  return (
    <div className='container mx-auto p-8 bg-gray-800 min-h-screen text-white'>
      <h1 className='text-4xl font-bold mb-8 text-center text-red-600'>
        About Dungeons & Dragons
      </h1>

      <div className='bg-gray-700 p-6 rounded-lg shadow-lg mb-8'>
        <p className='mb-4'>
          Dungeons & Dragons (D&D) is a fantasy tabletop role-playing game
          originally designed by Gary Gygax and Dave Arneson. Here are some
          basic rules and concepts to get you started:
        </p>

        <h2 className='text-2xl font-bold mt-6 mb-2 text-red-500'>
          Core Mechanics
        </h2>
        <ul className='list-disc pl-5 space-y-2 text-gray-300'>
          <li>
            <strong className='text-red-400'>Dice Rolling:</strong> D&D uses
            polyhedral dice, primarily a twenty-sided die (d20) for most
            actions.
          </li>
          <li>
            <strong className='text-red-400'>Ability Scores:</strong> Characters
            have six main abilities: Strength, Dexterity, Constitution,
            Intelligence, Wisdom, and Charisma.
          </li>
          <li>
            <strong className='text-red-400'>Skills:</strong> Characters can be
            proficient in various skills related to their abilities.
          </li>
          <li>
            <strong className='text-red-400'>Saving Throws:</strong> Used to
            resist effects like spells or traps.
          </li>
        </ul>

        <h2 className='text-2xl font-bold mt-6 mb-2 text-red-500'>
          Character Creation
        </h2>
        <ul className='list-disc pl-5 space-y-2 text-gray-300'>
          <li>
            <strong className='text-red-400'>Race:</strong> Choose from options
            like Human, Elf, Dwarf, etc., each with unique traits.
          </li>
          <li>
            <strong className='text-red-400'>Class:</strong> Pick a class such
            as Fighter, Wizard, Rogue, etc., which determines your character's
            abilities.
          </li>
          <li>
            <strong className='text-red-400'>Background:</strong> Define your
            character's history and additional proficiencies.
          </li>
        </ul>

        <h2 className='text-2xl font-bold mt-6 mb-2 text-red-500'>Combat</h2>
        <ul className='list-disc pl-5 space-y-2 text-gray-300'>
          <li>
            <strong className='text-red-400'>Initiative:</strong> Determines the
            order of turns in combat.
          </li>
          <li>
            <strong className='text-red-400'>Actions:</strong> On your turn, you
            can move and take one action (Attack, Cast a Spell, etc.).
          </li>
          <li>
            <strong className='text-red-400'>Armor Class (AC):</strong>{' '}
            Determines how hard a character is to hit.
          </li>
          <li>
            <strong className='text-red-400'>Hit Points (HP):</strong>{' '}
            Represents a character's health.
          </li>
        </ul>

        <h2 className='text-2xl font-bold mt-6 mb-2 text-red-500'>Magic</h2>
        <ul className='list-disc pl-5 space-y-2 text-gray-300'>
          <li>
            <strong className='text-red-400'>Spell Slots:</strong> Determines
            how many spells a character can cast.
          </li>
          <li>
            <strong className='text-red-400'>Spell Level:</strong> Indicates the
            power and complexity of a spell.
          </li>
          <li>
            <strong className='text-red-400'>Casting Time:</strong> How long it
            takes to cast a spell.
          </li>
        </ul>

        <p className='mt-6 text-gray-300'>
          Remember, these are just the basics. D&D is a complex game with many
          more rules and nuances. The fun comes from learning as you play!
        </p>
      </div>

      <Link
        href='/monsters'
        className='bg-red-600 text-white px-6 py-2 rounded-full mt-6 inline-block hover:bg-red-700 transition duration-300'>
        Explore Monsters
      </Link>
    </div>
  );
}
