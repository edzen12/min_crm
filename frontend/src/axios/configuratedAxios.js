import axios from "axios";
import { getLoggedInUser } from "../jwt/_services/authentication.service";
import { authenticationService } from "../jwt/_services";
import LocalStorageService from "../jwt/_services/LocalStorageService";
import { history } from "../jwt/_helpers";


const deleteAllCookies = () => {
    var cookies = document.cookie.split("; ");
    for (var c = 0; c < cookies.length; c++) {
        var d = window.location.hostname.split(".");
        while (d.length > 0) {
            var cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path=';
            var p = window.location.pathname.split('/');
            document.cookie = cookieBase + '/';
            while (p.length > 0) {
                document.cookie = cookieBase + p.join('/');
                p.pop();
            };
            d.shift();
        }
    }
}

const localStorageService = LocalStorageService.getService();

const { REACT_APP_API_URL } = process.env;

const authAxios = () => {
  const defaultOptions = {
    baseURL: REACT_APP_API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  };

    let configuratedAxios = axios.create(defaultOptions);

    configuratedAxios.interceptors.request.use(
        (config) => {
            const token = localStorageService.getAccessToken();
            config.headers.Authorization = token ? `Bearer ${token}` : "";
            return config;
        },
        (error) => {
            Promise.reject(error);
        }
    );

    configuratedAxios.interceptors.response.use(
        (response) => {
            return response;
        },
        function(error) {
            const originalRequest = error.config;

      if (
        error.response.status === 403 &&
        originalRequest.url === "https://crm-academy.tk/api/token/"
      ) {
        history.push("/authentication/login");
        return Promise.reject(error);
      }

            if (error.response.status === 403 && !originalRequest._retry) {
                originalRequest._retry = true;
                const refreshToken = localStorageService.getRefreshToken();
                return configuratedAxios
                    .post("token/refresh/", {
                        refresh: refreshToken,
                    })
                    .then((res) => {
                        if (res.status === 200) {
                            localStorageService.setToken(res.data);
                            const access_token = localStorageService.getAccessToken();

                            configuratedAxios.defaults.headers.common["Authorization"] =
                                "Bearer " + access_token;
                            return configuratedAxios(originalRequest);
                        }
                    })
                    .catch(e => {
                        localStorageService.clearToken();
                        deleteAllCookies();
                        authenticationService.logout()
                    })
            }
            return Promise.reject(error);
        }
    );

    return configuratedAxios;
};

export default authAxios();