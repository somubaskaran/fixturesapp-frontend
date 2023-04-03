// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    // API_BASE_URL: "https://dev-node-cardiacmd.enterpriseapplicationdevelopers.com:3027/",
    // API_BASE_URL:"https://staging-node-cardiacmd.enterpriseapplicationdevelopers.com:3028/",
    API_BASE_URL: 'http://localhost:3000/',
    //API_BASE_URL: 'https://uat-node-cardiacmd.enterpriseapplicationdevelopers.com:3035/',
    API_PATH: 'api/v1/',
    ENCRYPT: 'TSOLRgdkyuyFYrKZvaNiXdwHwq7Vsw==',
    IV: '5183666c72eec9e4',
    API_DOCTOR_URL: 'doctor/api/v1/',
    API_ADMIN_URL: 'admin/api/v1/',
    RECAPTCHA_KEY: '6LcOuyYTAAAAAHTjFuqhA52fmfJ_j5iFk5PsfXaU',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
