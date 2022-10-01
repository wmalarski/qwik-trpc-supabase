export const formEntries = (form: FormData) => {
  const data: Record<string, unknown> = {};
  form.forEach((value, key) => {
    data[key] = value;
  });
  return data;
};
