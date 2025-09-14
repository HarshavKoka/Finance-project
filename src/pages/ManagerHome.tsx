import { useNavigate } from "react-router-dom";

const ManagerHome = () => {
  const navigate = useNavigate();
  const blocks = [ 
    { label: "ITR", path: "itr" },
    { label: "GST", path: "gst" },
    { label: "MCA", path: "mca" },
    { label: "Employees", path: "employees" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-10">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl auto-rows-auto">
        <div
          onClick={() => navigate(`/manager-home/${blocks[0].path}`)}
          className="cursor-pointer bg-white shadow-lg rounded-xl p-10 text-center text-xl font-semibold hover:bg-blue-100 transition"
        >
          {blocks[0].label}
        </div>
        <div
          onClick={() => navigate(`/manager-home/${blocks[1].path}`)}
          className="cursor-pointer bg-white shadow-lg rounded-xl p-10 text-center text-xl font-semibold hover:bg-blue-100 transition"
        >
          {blocks[1].label}
        </div>
        <div
          onClick={() => navigate(`/manager-home/${blocks[2].path}`)}
          className="cursor-pointer bg-white shadow-lg rounded-xl p-10 text-center text-xl font-semibold hover:bg-blue-100 transition"
        >
          {blocks[2].label}
        </div>
        <div className="sm:col-start-2">
          <div
            onClick={() => navigate(`/manager-home/${blocks[3].path}`)}
            className="cursor-pointer bg-white shadow-lg rounded-xl p-10 text-center text-xl font-semibold hover:bg-blue-100 transition"
          >
            {blocks[3].label}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerHome;
