export const API_ENDPOINTS = {
    'USERS': '/users',
    'ROLES': '/roles',
    'UPDATE_ROLES': (id: string) => `/users/${id}/roles`,
    'CREATE_USER': '/users'
} as const;