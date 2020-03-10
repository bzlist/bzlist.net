import {storage, parseToken, api} from ".";

interface IUser{
  callsign: string;
  bzid: string;
  exp: number;
}

export const user: IUser = {
  callsign: "",
  bzid: "",
  exp: 0
};

export const userChanged: (() => void)[] = [];

const userChange = (): void => {
  for(const userChangedHandler of userChanged){
    userChangedHandler();
  }
};

export const updateUserCache = (): void => {
  const tokenData = parseToken();

  if(!tokenData || storage.get("refreshToken") === ""){
    signout();
    return;
  }

  user.callsign = tokenData.callsign;
  user.bzid = tokenData.bzid;
  user.exp = tokenData.exp;

  userChange();
};

export const checkAuth = async (): Promise<string | true> => {
  const token = storage.get("token");
  const refreshToken = storage.get("refreshToken");
  if(token === "" || refreshToken === ""){
    signout();
    return "not signed in";
  }

  const data = await api("users/", undefined, "GET", {
    ...(await authHeaders())
  });

  if(!data || data.error){
    user.callsign = "";
    user.bzid = "";
    user.exp = 0;

    userChange();

    if(data && data.error){
      console.error("error checking token:", data.error);
    }

    return data && data.error ? data.error : "unknown error";
  }

  user.callsign = data.callsign;
  user.bzid = data.bzid;

  return true;
};

export const signout = (): void => {
  user.callsign = "";
  user.bzid = "";
  user.exp = 0;
  storage.remove("token");
  storage.remove("refreshToken");

  userChange();
};

export const deleteAccount = async (): Promise<string | true> => {
  const token = storage.get("token");
  const refreshToken = storage.get("refreshToken");
  if(token === "" || refreshToken === ""){
    signout();
    return "not signed in";
  }

  const data = await api("users/", undefined, "DELETE", {
    ...(await authHeaders())
  });

  if(data.error){
    console.error("error delete account:", data.error);
    return data.error;
  }

  signout();
  return true;
};

export const authHeaders = async (): Promise<Object> => {
  const refreshToken = storage.get("refreshToken");
  const tokenData = parseToken();

  if(refreshToken !== "" && (!tokenData || tokenData.exp - (Date.now() / 1000) <= 0)){
    const data = await api("users/token/renew", {token: storage.get("token"), refreshToken}, "POST");
    if(!data || !data.token || !data.refreshToken){
      console.log("could not refresh token");
      signout();
      return {};
    }

    storage.set("token", data.token);
    storage.set("refreshToken", data.refreshToken);
    updateUserCache();
  }

  return {
    "Authorization": `Bearer ${storage.get("token")}`
  };
};
