declare module "express-validator" {
  export function body(field: string | string[], message?: string): any;
  export function param(field: string | string[], message?: string): any;
  export function query(field: string | string[], message?: string): any;
  export function header(field: string | string[], message?: string): any;
  export function cookie(field: string | string[], message?: string): any;
  export function validationResult(req: any): any;
  export function matchedData(req: any, options?: any): any;
  export function checkSchema(schema: any): any[];
  export function oneOf(validationChains: any[], message?: string): any;
  export function buildCheckFunction(locations: string[]): any;
}
