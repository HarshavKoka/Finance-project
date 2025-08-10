import { useNavigate } from 'react-router-dom';

const FinancialCoverPage = () => {
  const navigate = useNavigate(); 

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg text-center space-y-4">
 
        <div className="flex justify-center">
          <div className="bg-blue-100 p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a4 4 0 00-8 0v2H5v10h14V9h-2z" />
            </svg>
          </div>
        </div>

        <h1 className="text-xl font-bold text-blue-900">All Financial Services at One Place</h1>

    
        <p className="text-gray-600 text-sm px-2">
          From GST to ITR, MCA to PAN – Everything You Need, Right Here, Every Thing You Need, Right Here.
        </p>
        
        <div className="grid grid-cols-3 gap-3 text-sm">
          {[
            { name: "GST Filing", icon: "📄" },
            { name: "ITR", icon: "💰" },
            { name: "PAN Services", icon: "🏛️" },
            { name: "TDS Filing", icon: "📥" },
            { name: "TAN Registration", icon: "📝" },
            { name: "PF & ESI", icon: "🏬" },
            { name: "Digital Signature (DSC)", icon: "✍️" },
            { name: "Business Registration", icon: "🏢" },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-blue-50 rounded p-3 flex flex-col items-center justify-center text-blue-900 border border-blue-100 hover:bg-blue-100"
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-center text-xs mt-1">{item.name}</span>
            </div>
          ))}
        </div>

       
        <button
          className="mt-4 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-full transition"
          onClick={() => navigate('/login')} 
        >
          Explore Services
        </button>
      </div>
    </div>
  );
};

export default FinancialCoverPage;
