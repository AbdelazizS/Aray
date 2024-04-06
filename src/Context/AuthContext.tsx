import axios from "axios";
import { useContext, createContext, useState } from "react";

// type MyType = Promise<Value|void>

export type GlobalContent = {
  token: string;
  user: { name?: String; status?: String; id?: number };
  logOut: () => void;
  loginAction: (c: any) => void;
  updateAction: (c: any) => void;
  deleteAction: (c: any) => void;
};

const AuthContext = createContext<GlobalContent>({
  token: "",
  logOut: () => {},
  loginAction: () => {},
  updateAction: () => {},
  deleteAction: () => {},
  user: {},
});

axios.defaults.baseURL = "https://api.aray.tarhil.com/";

const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(
    JSON.parse(localStorage.getItem("user_info")!)
  );
  const [token, setToken] = useState(
    localStorage.getItem("access_token") || ""
  );

  const deleteAction = async () => {
    return new Promise((resolve, reject) => {
      axios
        .delete(`user/delete-user/${user.id}`, {
          headers: {
            "x-auth-token": token,
          },
        })
        .then((response) => {
          resolve(response);
          setUser(null);
          setToken("");
          localStorage.removeItem("access_token");
          localStorage.removeItem("user_info");
          return;
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const updateAction = async (data: any) => {
    return new Promise((resolve, reject) => {
      console.log(data);

      axios
        .patch(
          `user/update-user/${user.id}`,
          {
            phone_no: data.phone,
            name: data.user,
            email: data.email || "",
          },
          {
            headers: {
              "x-auth-token": token,
            },
          }
        )
        .then((response) => {
          resolve(response);
          const userInfo = JSON.stringify({
            ...user,
            phone_no: data.phone,
            name: data.user,
            email: data.email,
          });
          localStorage.setItem("user_info", userInfo);
          setUser(JSON.parse(userInfo));
          return;
        })
        .catch((error) => {
          reject(error);
          console.log(error);
        });
    });
  };

  // const navigate = useNavigate();
  const loginAction = async (data: any) => {
    const userInfo = JSON.stringify(data.userInfo);
    setToken(data.token);
    setUser(userInfo);
    localStorage.setItem("access_token", data.token);
    localStorage.setItem("user_info", userInfo);

    console.log(data);

    // return new Promise((resolve, reject) => {
    //   axios
    //     .post("auth/login", {
    //       phone_no: data.phone,
    //       password: data.password,
    //     })
    //     .then((response) => {
    //       resolve(response);

    //       const userInfo = JSON.stringify(response.data.userInfo);
    //       setToken(response.data.token);
    //       setUser(userInfo);
    //       localStorage.setItem("access_token", response.data.token);
    //       localStorage.setItem("user_info", userInfo);
    //       return;
    //     })
    //     .catch((error) => {
    //       reject(error);
    //     });
    // });
    // if (res.data) {
    //   setUser(res.data.user);
    //   setToken(res.token);
    //   localStorage.setItem("site", res.token);
    //   // navigate("/dashboard");
    //   return;
    // }
    //   throw new Error(res.message);
    // } catch (err) {
    //   console.error(err);
    // }
  };

  const logOut = async () => {
    return new Promise((resolve, reject) => {
      setUser(null);
      setToken("");
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_info");
      axios
        .post(`auth/logout`, {
          headers: {
            "x-auth-token": token,
          },
        })
        .then((response) => {
          resolve(response);
          console.log(response, "logout", token);
        })
        .catch((error) => {
          console.log(token);
          reject(error);
          console.log(error, "logout");
        });
    });
  };

  return (
    <AuthContext.Provider
      value={{ token, user, loginAction, logOut, updateAction, deleteAction }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
