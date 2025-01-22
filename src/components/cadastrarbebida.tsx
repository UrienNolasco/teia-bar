"use client";
/* eslint-disable react/react-in-jsx-scope */


import { CirclePlus } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import { toast } from "react-toastify";
import { cadastrarBebida } from "@/app/actions/create-bebida";

const CadastrarBebida = () => {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    valor: "",
    quantidade: "",
    imageUrl: "", // Alterado para corresponder ao ID do campo
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleOnClickSave = async () => {
    try {
      if (!formData.nome || !formData.descricao || !formData.valor || !formData.quantidade) {
        toast.warning("Preencha todos os campos");
        return;
      }

      // Verificar se as conversões são válidas
      const valor = parseFloat(formData.valor);
      const quantidade = parseInt(formData.quantidade, 10);

      if (isNaN(valor) || isNaN(quantidade)) {
        toast.warning("Valor ou Quantidade inválidos");
        return;
      }

      await cadastrarBebida({
        nome: formData.nome,
        descricao: formData.descricao,
        valor: valor,
        quantidadeEstoque: quantidade,
        imageUrl: formData.imageUrl,
      });

      toast.success("Bebida cadastrada com sucesso");
    } catch (error) {
      console.error("Erro ao cadastrar bebida:", error); // Logar o erro para debug
      toast.error("Erro ao cadastrar bebida");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="justify-start gap-2">
          <CirclePlus /> Adicionar Bebidas
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[80%] rounded-2xl">
        <DialogTitle className="text-2xl">Cadastrar Bebida</DialogTitle>
        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-4 gap-20 items-center">
            <Label className="text-base" htmlFor="nome">Bebida</Label>
            <Input id="nome" className="col-span-3 text-sm py-1 px-2" value={formData.nome} onChange={handleInputChange} />
          </div>
        </div>
        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-4 gap-20 items-center">
            <Label className="text-base" htmlFor="descricao">Descrição</Label>
            <Input id="descricao" className="col-span-3 text-sm py-1 px-2" value={formData.descricao} onChange={handleInputChange} />
          </div>
        </div>
        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-4 gap-20 items-center">
            <Label className="text-base" htmlFor="valor">Valor</Label>
            <Input id="valor" type="number" className="col-span-3 text-sm py-1 px-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" value={formData.valor} onChange={handleInputChange} />
          </div>
        </div>
        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-4 gap-20 items-center">
            <Label className="text-base" htmlFor="quantidade">Quantidade</Label>
            <Input id="quantidade" type="number" className="col-span-3 text-sm py-1 px-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" value={formData.quantidade} onChange={handleInputChange} />
          </div>
        </div>
        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-4 gap-20 items-center">
            <Label className="text-base" htmlFor="imageUrl">ImageUrl</Label>
            <Input id="imageUrl" className="col-span-3 text-sm py-1 px-2" value={formData.imageUrl} onChange={handleInputChange} />
          </div>
        </div>
        <DialogFooter className="mt-2">
          <Button onClick={handleOnClickSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CadastrarBebida;
