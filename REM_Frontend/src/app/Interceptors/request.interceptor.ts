import { HttpInterceptorFn } from '@angular/common/http';
import { StorageService } from '../user/UserService/storage.service';

export const requestInterceptor: HttpInterceptorFn = (req, next) => {

  // Exclude signin and register URLs (adjust according to your backend routes)
  const excludedUrls = [
    '/auth/signup',
    '/auth/login',
    '/auth/verify',
    '/auth/resendCode',
    '/auth/getAllProperties',
  ];

  // Check if current request URL is in excluded list
  const shouldExclude = excludedUrls.some(url => req.url.includes(url));

  if (shouldExclude) {
    return next(req);
  }

  // Get token (change this if you use a service instead of localStorage)
  const token = StorageService.getToken();

  if (token) {
    // Clone request and set Authorization header
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(authReq);
  }

  // No token? Proceed with the original request
  return next(req);

};
