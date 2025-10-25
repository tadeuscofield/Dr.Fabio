import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Usuários do sistema
  const users = {
    fabio: {
      username: 'fabio',
      password: 'FABIO2024',
      name: 'Dr. Fábio Silva',
      role: 'dentista',
      cro: 'RJ 45678'
    },
    secretaria: {
      username: 'secretaria',
      password: 'SEC2024',
      name: 'Recepção',
      role: 'secretaria'
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('dental-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = (username, password) => {
    const foundUser = users[username];

    if (!foundUser || foundUser.password !== password) {
      return { success: false, error: 'Usuário ou senha incorretos' };
    }

    const userData = {
      name: foundUser.name,
      role: foundUser.role,
      cro: foundUser.cro
    };

    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('dental-user', JSON.stringify(userData));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('dental-user');
  };

  const isDentista = () => user?.role === 'dentista';
  const isSecretaria = () => user?.role === 'secretaria';

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      logout,
      isDentista,
      isSecretaria
    }}>
      {children}
    </AuthContext.Provider>
  );
};
