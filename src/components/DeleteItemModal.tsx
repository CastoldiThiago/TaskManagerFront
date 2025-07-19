import React from "react"
import { Modal, Box, Typography, Button, Stack } from "@mui/material"

interface DeleteItemModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  type: "task" | "list"
  name?: string
}

export default function DeleteItemModal({
  open,
  onClose,
  onConfirm,
  type,
  name,
}: DeleteItemModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          p: 4,
          minWidth: 320,
          maxWidth: 400,
          outline: "none",
        }}
      >
        <Typography variant="h6" fontWeight={700} mb={2}>
          Confirm {type === "task" ? "task" : "list"} deletion
        </Typography>
        <Typography variant="body1" mb={3}>
          Are you sure you want to delete {type === "task" ? "this task" : "this list"}
          {name ? <> <b>{name}</b></> : ""}?
          {type === "list" && (
            <span> All tasks in this list will also be deleted.</span>
          )}
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={onConfirm}>
            Delete
          </Button>
        </Stack>
      </Box>
    </Modal>
  )
}