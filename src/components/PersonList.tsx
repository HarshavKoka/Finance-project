import type{ Person } from "../pages/PeoplePage"

interface Props {
  people: Person[]
  onSelect: (person: Person) => void
}

const PersonList = ({ people, onSelect }: Props) => {
  return (
    <div className="flex flex-wrap gap-4">
      {people.map((person, index) => (
        <button
          key={index}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => onSelect(person)}
        >
          {person.name}
        </button>
      ))}
    </div>
  )
}

export default PersonList
