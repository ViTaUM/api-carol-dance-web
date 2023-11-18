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

app.get("/reservas", (req, res) => {
  return res.json(reservas);
});

app.post("/reserva", (req, res) => {
  const { assentos, idassentos, name, cpf, email, valor } = req.body;

  const newReserva = {
    id: Math.random().toString(36),
    assentos,
    idassentos,
    name,
    cpf,
    email,
    valor,
    status: "pendente",
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

// Rota para atualizar o status da reserva de "pendente" para "pago"
app.put("/assentos/:id/false", (req, res) => {
  const { id } = req.params;

  // Converta o 'id' da rota para número
  const seatId = parseInt(id);

  // Encontre o assento correspondente pelo ID em todos os arrays
  let assentoEncontrado = null;

  for (const arrayDeAssentos of assentos) {
    const assento = arrayDeAssentos.find((r) => r.id === seatId);

    if (assento) {
      assentoEncontrado = assento;
      break;
    }
  }

  if (!assentoEncontrado) {
    return res.status(404).json({ error: "Assento não encontrado" });
  }

  // Atualize o isAvailable para "false"
  assentoEncontrado.isAvailable = false;

  return res.json(assentoEncontrado);
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
