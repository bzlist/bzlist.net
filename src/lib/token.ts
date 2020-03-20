import {storage} from ".";

export const parseToken = (): any | null => {
  const token = storage.get("token");
  if(token === ""){
    return null;
  }

  try{
    const data = JSON.parse(window.atob(token.split(".")[1].replace("-", "+").replace("_", "/")));
    return data;
  }catch(err){
    console.warn("token is not a valid format");
    storage.remove("token");
  }

  return null;
};
