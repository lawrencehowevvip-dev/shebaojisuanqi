import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface City {
  id: number;
  city_name: string;
  year: string;
  base_min: number;
  base_max: number;
  rate: number;
}

export interface Salary {
  id: number;
  employee_id: string;
  employee_name: string;
  month: string;
  salary_amount: number;
}

export interface Result {
  id: number;
  employee_name: string;
  avg_salary: number;
  contribution_base: number;
  company_fee: number;
}

// Helper functions for database operations
export const db = {
  // Cities operations
  async getCities(): Promise<City[]> {
    const { data, error } = await supabase
      .from('cities')
      .select('*');
    if (error) throw error;
    return data || [];
  },

  async insertCities(cities: Omit<City, 'id'>[]): Promise<void> {
    const { error } = await supabase
      .from('cities')
      .insert(cities);
    if (error) throw error;
  },

  async clearCities(): Promise<void> {
    const { error } = await supabase
      .from('cities')
      .delete()
      .neq('id', 0);
    if (error) throw error;
  },

  // Salaries operations
  async getSalaries(): Promise<Salary[]> {
    const { data, error } = await supabase
      .from('salaries')
      .select('*')
      .order('month', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async insertSalaries(salaries: Omit<Salary, 'id'>[]): Promise<void> {
    const { error } = await supabase
      .from('salaries')
      .insert(salaries);
    if (error) throw error;
  },

  async clearSalaries(): Promise<void> {
    const { error } = await supabase
      .from('salaries')
      .delete()
      .neq('id', 0);
    if (error) throw error;
  },

  // Results operations
  async getResults(): Promise<Result[]> {
    const { data, error } = await supabase
      .from('results')
      .select('*')
      .order('employee_name', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async insertResults(results: Omit<Result, 'id'>[]): Promise<void> {
    const { error } = await supabase
      .from('results')
      .insert(results);
    if (error) throw error;
  },

  async clearResults(): Promise<void> {
    const { error } = await supabase
      .from('results')
      .delete()
      .neq('id', 0);
    if (error) throw error;
  },
};
