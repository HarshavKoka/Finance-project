import axios from "axios"

interface Props {
  group: string
}

function SettingsButton({ group }: Props) {
  const handleClick = async () => {
    try {
      const res = await axios.get("http://localhost:4000/auto-login", {
        params: { group },
      })

      console.log("Auto-login success:", res.data)
    } catch (err) {
      console.error("Auto-login failed:", err)
    }
  }

  return (
    <button
      className="px-2 mt-3 text-gray-600 hover:text-gray-800 cursor-pointer"
      onClick={handleClick}
      title={`Auto-login to ${group}`}
    >
      ⚙️
    </button>
  )
}

export default SettingsButton
