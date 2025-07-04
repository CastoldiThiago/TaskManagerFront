import React from "react"
import { Box, Typography, Container, Stack, Card, CardContent, CardHeader, Button } from "@mui/material"
import { useTitle } from "../../../context/TitleContext"

export default function HomePage() {
  const {setTitle} = useTitle()
  React.useEffect(() => {
    setTitle("Dashboard")
  }, [setTitle])
  return (
    <Box sx={{ p: 3 }}>

      <Container maxWidth="xl" disableGutters>
        <Stack direction={{ xs: "column", md: "row" }} spacing={3} sx={{ width: "100%" }}>
          <Card sx={{ flex: 1 }}>
            <CardHeader title="Mi día" subheader="Tareas para hoy" />
            <CardContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                No tienes tareas pendientes para hoy.
              </Typography>
              <Button size="small" variant="contained">
                Añadir tarea
              </Button>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardHeader title="Próximas" subheader="Tareas próximas" />
            <CardContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                No tienes tareas próximas.
              </Typography>
              <Button size="small" variant="contained">
                Ver todas
              </Button>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardHeader title="Calendario" subheader="Eventos programados" />
            <CardContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                No tienes eventos programados.
              </Typography>
              <Button size="small" variant="contained">
                Ver calendario
              </Button>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  )
}
