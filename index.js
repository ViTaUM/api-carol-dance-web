import express from "express";
import cors from "cors";
import Assentos from "./assentos.js";

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3001;

let reservas = [];

let assentos = Assentos;

app.get("/", (req, res) => {
  return res.json("Tá funcionando!");
});

app.get("/assentos", (req, res) => {
  return res.json(assentos);
});

app.post("/reservas", (req, res) => {
  const { assentos, name, cpf, email, valor } = req.body;

  const newReserva = {
    id: Math.random().toString(36),
    assentos,
    name,
    cpf,
    email,
    valor,
    status: 'pendente',
  };

  reservas.push(newReserva);
  return res.json(newReserva);
});

// Rota para atualizar o status da reserva de "pendente" para "pago"
app.put("/reservas/:id/pagar", (req, res) => {
  const { id } = req.params;

  // Encontre a reserva correspondente pelo ID
  const reserva = reservas.find((r) => r.id === id);

  if (!reserva) {
    return res.status(404).json({ error: "Reserva não encontrada" });
  }

  // Atualize o status para "pago"
  reserva.status = "pago";

  return res.json(reserva);
});

app.delete("/reservas/:id", (req, res) => {
  const { id } = req.params;

  const index = reservas.findIndex((reserva) => reserva.id === id);

  if (index < 0) {
    return res.status(404).json({ error });
  }

  reservas.splice(index, 1);
  return res.status(204).json();
});

app.listen(port, () => console.log(`listening on ${port}`));
