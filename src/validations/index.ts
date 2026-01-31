// Simple validation wrapper
export const validateRequest = (validations: any[]) => {
  return async (req: any, res: any, next: any) => {
    // Run all validations
    for (const validation of validations) {
      await new Promise((resolve) => validation(req, res, resolve));
    }

    next();
  };
};
