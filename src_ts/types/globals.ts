/*
* The type Constructor<T> is an alias for the construct signature
* that describes a type which can construct objects of the generic type T
* and whose constructor function accepts an arbitrary number of parameters of any type
* On the type level, a class can be represented as a newable function
*/
export type Constructor<T> = new (...args: any[]) => T;

export interface GenericObject {
  [key: string]: any;
}

export interface ActionPoint {
  partner: GenericObject | null;
  // category: number;
  assigned_to: GenericObject | null;
  section: GenericObject | null;
  psea_assessment: number | null | undefined;
  office: GenericObject | null;
  description: string;
  due_date: string;
  id: number | string | null;
  high_priority: boolean;
}
