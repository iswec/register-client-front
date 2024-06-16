import "./App.css";
import { FiTrash } from "react-icons/fi";
import { api } from "./services/api";
import { useEffect, useRef, useState, FormEvent } from "react";

interface CustomerProps {
  id: string;
  name: string;
  email: string;
  status: boolean;
  creat_at: string;
  update_at: string;
}

function App() {
  const [customers, setCustomers] = useState<CustomerProps[]>([]);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadCostumers();
  }, []);

  async function loadCostumers() {
    const response = await api.get("/customers");
    setCustomers(response.data);
  }

  async function handleForm(event: FormEvent) {
    event.preventDefault();

    if (!nameRef.current?.value || !emailRef.current?.value) return;

    const response = await api.post("/customer", {
      name: nameRef.current?.value,
      email: emailRef.current?.value,
    });

    if (response.status === 200) {
      setCustomers((allCustomers) => [...allCustomers, response.data]);
      nameRef.current.value = "";
      emailRef.current.value = "";
    }
  }

  async function handleDelete(id: string) {
    try {
      await api.delete("./customer", {
        params: {
          id: id,
        },
      });

      const allcustomers = customers.filter((customer) => customer.id !== id);

      setCustomers(allcustomers);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="w-full min-h-screen bg-gray-900 flex justify-center px-4">
        <main className="my-10 w-full md:max-w-2xl">
          <h1 className="text-4xl font-medium text-white">Clientes</h1>
          <form>
            <label className="font-medium text-white">Nome:</label>
            <input
              type="text"
              placeholder="Digite seu nome"
              className="w-full mb-5 p-2 rounded"
              ref={nameRef}
            />
            <label className="font-medium text-white">Email:</label>
            <input
              type="email"
              placeholder="Digite seu email"
              className="w-full mb-5 p-2 rounded"
              ref={emailRef}
            />

            <input
              type="submit"
              value="Cadastrar"
              className="cursor-pointer w-full p-2 bg-green-500 rounded font-medium text-white mb-5"
              onClick={handleForm}
            />
          </form>
          <section className="flex flex-col gap-4">
            {customers.map((clientes) => {
              return (
                <article
                  key={clientes.id}
                  className="w-full bg-white rounded p-2 relative hover:scale-105 duration-200"
                >
                  <p>
                    <span className="font-medium">Nome: </span>
                    {clientes?.name}
                  </p>
                  <p>
                    <span className="font-medium">Email: </span>
                    {clientes?.email}
                  </p>
                  <p>
                    <span className="font-medium">Status: </span>
                    {clientes?.status ? "Ativo" : "Inativo"}
                  </p>

                  <button
                    className="bg-red-500 w-7 h-7 flex items-center justify-center rounded absolute -right-2 -top-2 hover:bg-red-700 duration-200"
                    onClick={() => handleDelete(clientes.id)}
                  >
                    <FiTrash size={18} color="#fff" />
                  </button>
                </article>
              );
            })}
          </section>
        </main>
      </div>
    </>
  );
}

export default App;
