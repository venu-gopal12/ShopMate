import { useContext } from "react";
import { Navigate, useLocation, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const SellerRoute = ({ children }) => {
  const { user, loading, refreshProfile } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (user && user.role === "seller") {
    if (!user.isSellerApproved) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-gray-100">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Application Pending</h2>
                    <p className="text-gray-500 mb-8">
                        Your seller application is currently under review by our admin team. You will be notified once it is approved.
                    </p>
                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={() => {
                                refreshProfile();
                                // Optional: simple reload if state doesn't update fast enough or purely visual
                                window.location.reload(); 
                            }}
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                        >
                            Check Status Again
                        </button>
                        <Link to="/" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-xl text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors">
                            Return to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
    return children;
  }

  // If user is admin, they might want to see seller views too? 
  // For now, redirect admins to their dashboard or let them pass if we treat admin as superuser.
  // But typically admin has their own dashboard.
  if (user && user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/seller/register" state={{ from: location }} replace />;
};

export default SellerRoute;
