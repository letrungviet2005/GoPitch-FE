import axios from "axios";
import config from "../config/config";
const apiClient = axios.create({baseURL:config,withCredentials:true,timeout:15000});
apiClient.interceptors.request.use(req=>{const token=localStorage.getItem("accessToken")||sessionStorage.getItem("accessToken");if(token)req.headers.Authorization=`Bearer ${token}`;return req;});
let refreshing: Promise<string> | null=null;
apiClient.interceptors.response.use(r=>r,async error=>{
  const req=error.config;
  if(error.response?.status!==401 || !req || req._retried || req.url?.includes("/auth/"))throw error;
  req._retried=true;
  refreshing ??= axios.post(`${config.replace(/\/$/,"")}/auth/refresh`,{}, {withCredentials:true,timeout:10000}).then(r=>{
    const storage=localStorage.getItem("accessToken")?localStorage:sessionStorage;
    storage.setItem("accessToken",r.data.accessToken);return r.data.accessToken as string;
  }).finally(()=>{refreshing=null;});
  try{req.headers.Authorization=`Bearer ${await refreshing}`;return await apiClient(req);}
  catch(e){for(const s of [localStorage,sessionStorage])for(const key of ["accessToken","userId","userName","userRole"])s.removeItem(key);throw e;}
});
export default apiClient;
export function unwrapResult<T>(data:T|{result?:T}):T {return data&&typeof data==="object"&&"result" in data?(data as {result:T}).result:data as T;}
export function errorMessage(e:unknown):string {return axios.isAxiosError(e)?String(e.response?.data?.message||e.response?.data?.detail||"Không thể kết nối dịch vụ"):e instanceof Error?e.message:"Thao tác thất bại";}
