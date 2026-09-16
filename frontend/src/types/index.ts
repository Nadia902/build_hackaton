export interface SocialObject {
  id: number;
  num: number | null;
  grbs: string | null;
  oks_name: string | null;
  construction_stage: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  industry: string | null;
  status: string | null;
  ownership: string | null;
  amo: string | null;
  customer: string | null;
  np_gp_name: string | null;
  fp_name: string | null;
  project_code: string | null;
  total_area_m2: number | null;
  capacity: string | null;
  expertise: string | null;
  year_start: number | null;
  year_end: number | null;
  construction_period: string | null;
  land_transfer_date: string | null;
  building_permit_date: string | null;
  contract_date: string | null;
  contract_period: string | null;
  contractor: string | null;
  construction_readiness: number | null;
  equipment_installation_date: string | null;
  hydro_test_date: string | null;
  zos_date: string | null;
  zos_number: string | null;
  act_input_date: string | null;
  act_input_number: string | null;
  year_commissioned: number | null;
  photo_before: string | null;
  photo_after: string | null;
}

export interface Filters {
  yearStart: number[];
  industry: string;
  constructionStage: string;
  search: string;
}

export interface Builder {
  id: number;
  municipality: string | null;
  category: string | null;
  title: string;
  address: string | null;
  longitude: number | null;
  latitude: number | null;
}

export const BUILDER_CATEGORIES = ['Спортивная площадка', 'МБОУ ЦО', 'Больница'] as const;

export type TrafficColor = 'green' | 'yellow' | 'red';



export interface MunicipalityColors {
  municipality: string;
  population_total: number | null;
  schools_per_1000: number | null;
  color_school: TrafficColor | null;
  hospitals_count: number | null;
  people_per_hospital: number | null;
  color_hospital: TrafficColor | null;
  sports_count: number | null;
  people_per_sport: number | null;
  color_sport: TrafficColor | null;
}



export const BUILDER_CATEGORY_COLOR_FIELD: Record<string, keyof MunicipalityColors> = {
  'Больница': 'color_hospital',
  'МБОУ ЦО': 'color_school',
  'Спортивная площадка': 'color_sport',
};
