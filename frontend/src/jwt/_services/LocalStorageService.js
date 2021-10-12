import jwtDecode from 'jwt-decode';
import { getLoggedInUser } from './authentication.service'

const LocalStorageService = (function() {
    let _service;

    function _getService() {
        if (!_service) {
            _service = this;
            return _service;
        }

        return _service;
    }

    function _setToken(tokenObj) {
        localStorage.setItem('currentUser', JSON.stringify(tokenObj));
        // localStorage.setItem('access_token', tokenObj.access);
        // localStorage.setItem('refresh_token', tokenObj.refresh);
    }

    function _getAccessToken() {
        const user = getLoggedInUser();
        return user.access;
    }

    function _getRefreshToken() {
        const user = getLoggedInUser();
        return user.refresh;
    }

    function _clearToken() {
        localStorage.removeItem('currentUser');
    }
    return {
        getService: _getService,
        setToken: _setToken,
        getAccessToken: _getAccessToken,
        getRefreshToken: _getRefreshToken,
        clearToken: _clearToken
    }

})();

export default LocalStorageService;