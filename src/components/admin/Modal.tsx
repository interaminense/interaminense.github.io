import { Box, Modal as MaterialModal, Typography } from "@mui/material";

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};

interface IModalProps extends React.HTMLAttributes<HTMLElement> {
  open: boolean;
  title: string;
  onClose: () => void;
}

export function Modal({ open, onClose, title, children }: IModalProps) {
  return (
    <MaterialModal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          sx={{ marginBottom: 2 }}
        >
          {title}
        </Typography>

        {children}
      </Box>
    </MaterialModal>
  );
}
