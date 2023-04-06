import { BaseTextFieldProps, TextField } from "@mui/material";

interface IFieldProps extends BaseTextFieldProps {
  name: string;
  onBlur: (e: React.FocusEvent<any, Element>) => void;
  onChange: (e: React.FocusEvent<any, Element>) => void;
  label: string;
  value?: string;
}

export function Field({
  name,
  onBlur,
  onChange,
  label,
  value,
  ...otherProps
}: IFieldProps) {
  return (
    <TextField
      {...otherProps}
      name={name}
      onBlur={onBlur}
      onChange={onChange}
      label={label}
      margin="dense"
      InputLabelProps={{ shrink: true }}
      value={value}
    />
  );
}
