export interface IPagination {
  page: number;
  limit: number;
}

export interface IPaginationResp {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}

export interface IRolesOptions {
  key: number;
  rolId: string;
  label: string;
  estado: boolean;
}


export interface IUserProfile {
  user: {
    name: string;
    rolName: string;
    callsPending: number;
  };
}