export enum MESSAGES {
  AN_ERROR_OCCURRED = "an error occured.",
  DATA_CREATED = "data created.",
  DATA_CREATED_FAIL = "an error occurred while creating data.",
  DATA_DELETED = "data deleted.",
  DATA_NOT_FOUND = "data not found.",
  DATA_UPDATED = "data updated.",
  PLEASE_AUTH_USER = "please, authenticate user.",
  PLEASE_INSERT_CORRECT_ID = "please, insert a valid id.",
  USER_DOES_NOT_HAVE_PERMISSION = "user does not have permission to update data.",
  USER_IS_AUTH = "user is authenticated.",
  USER_IS_NOT_AUTH = "user is not authenticated.",
  USER_IS_NOT_AUTH_FAIL = "an error occured and the user is still authenticated.",
}

export const PREFIX = (nameDB: string) => `[DataBase ${nameDB}]`;
