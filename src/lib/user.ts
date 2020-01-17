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
  for(const userChangedHandler of userChanged) {
    userChangedHandler();
  }
};

export const updateUserCache = (): void => {
  const tokenData = parseToken();

  if(!tokenData){
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
  if(token === ""){
    signout();
    return "not signed in";
  }

  const data = await api("users/", undefined, "GET", {
    "Authorization": `Bearer ${token}`
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

  userChange();
};

export const deleteAccount = async (): Promise<string | true> => {
  const token = storage.get("token");
  if(token === ""){
    signout();
    return "not signed in";
  }

  const data = await api("users/", undefined, "DELETE", {
    "Authorization": `Bearer ${token}`
  });

  if(data.error){
    console.error("error delete account:", data.error);
    return data.error;
  }

  signout();
  return true;
};
