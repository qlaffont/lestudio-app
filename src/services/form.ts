export const getError = (errors: Record<string, string[]> | null, name: string) => {
  if (!errors) {
    return undefined;
  }

  return errors[name]?.[0] ? { message: errors[name]?.[0] } : undefined;
};
