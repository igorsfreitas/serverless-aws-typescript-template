export type TReflectPartialEntityProperties<T> = Partial<{
  [key in keyof T]: T[key];
}>;

export type TAcceptedEntityproperties<T> = Partial<{
  [key in keyof T]: boolean;
}>;
