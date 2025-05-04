export type User = {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at: string;
  updated_at?: string;
};

export type Division = {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at?: string;
};

export type Position = {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at?: string;
};

export type Employee = {
  id: number;
  position_id: number;
  division_id: number;
  email: string;
  name: string;
  image?: string;
  gender: boolean;
  status: boolean;
  created_at: string;
  updated_at: string;
};

export type EmployeeResource = {
  data: (Employee & { division?: Division; position?: Position })[];
  agg: { count: number; status: { active: boolean; noactive: boolean } };
};
export type DivisionResource = {
  data: (Division & { employees?: Employee[] })[];
};
export type PositionResource = {
  data: (Position & { employees?: Employee[] })[];
};