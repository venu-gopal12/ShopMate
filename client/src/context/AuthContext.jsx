import { createContext, useState, useEffect, useMemo } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on refresh
  // Load user on refresh
  useEffect(() => {
    const checkUser = async () => {
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
            try {
                // Verify token and get latest user data
                // We need an API call here. Importing API helper or using fetch.
                // Since API helper might use AuthContext, we need to be careful of circular deps if we import API.
                // But usually API just imports axios.
                // Let's assume we can fetch.
                // Actually, let's use the 'api' instance if possible, or simple fetch.
                // Better: Use a function that uses the token.
                
                const res = await fetch("http://localhost:5000/api/users/profile", {
                    headers: {
                        Authorization: `Bearer ${savedToken}`
                    }
                });
                
                if (res.ok) {
                    const userData = await res.json();
                    setUser(userData);
                    localStorage.setItem("user", JSON.stringify(userData)); // Sync local storage
                } else {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                }
            } catch (error) {
                console.error("Auth check failed", error);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }
        }
        setLoading(false);
    };
    checkUser();
  }, []);

  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const register = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const refreshProfile = async () => {
      const token = localStorage.getItem("token");
      if(token){
          try {
             const res = await fetch("http://localhost:5000/api/users/profile", {
                headers: { Authorization: `Bearer ${token}` }
             });
             if(res.ok){
                 const userData = await res.json();
                 setUser(userData);
                 localStorage.setItem("user", JSON.stringify(userData));
             }
          } catch(e){
              console.error(e);
          }
      }
  };

  const value = useMemo(() => ({
    user, login, register, logout, loading, refreshProfile
  }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
