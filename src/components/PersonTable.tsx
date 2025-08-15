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
            <th className="p-3">Email</th>
            <th className="p-3">PAN Name</th>
            <th className="p-3">PAN Number</th>
            <th className="p-3">Phone</th>
            <th className="p-3">ID Type</th>
            <th className="p-3">ITR Last 3 Years</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-3">{person.name}</td>
            <td className="p-3">{person.age}</td>
            <td className="p-3">{person.city}</td>
            <td className="p-3">{person.email}</td>
            <td className="p-3">{person.panName}</td>
            <td className="p-3">{person.panNumber}</td>
            <td className="p-3">{person.phoneNumber}</td>
            <td className="p-3">{person.idType}</td>
            <td className="p-3">{person.itrLast3Years}</td>
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
