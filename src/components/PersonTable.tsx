import type { Person } from "../pages/PeoplePage"

interface Props {
  person: Person
  onDelete: () => void
}

const PersonTable = ({ person, onDelete }: Props) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">Name</th>
            <th className="p-3">Age</th>
            <th className="p-3">City</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-3">{person.name}</td>
            <td className="p-3">{person.age}</td>
            <td className="p-3">{person.city}</td>
            <td className="p-3">
              <button
                onClick={onDelete}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default PersonTable
