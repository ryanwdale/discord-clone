import Cookies from "js-cookie";

const GetCsrfCookie = () => Cookies.get("csrf_access_token");

export default GetCsrfCookie;
