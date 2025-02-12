"use client";
/* eslint-disable react/react-in-jsx-scope */

import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Edit } from "lucide-react"; // ícone para edição
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { getProdutos } from "@/app/actions/get-produto";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { isUserAdmin } from "@/app/actions/get-useradmin";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { atualizarBebida } from "@/app/actions/uptade-produtos";

interface Produto {
  id: string;
  nome: string;
  descricao: string | null;
  valor: number;
  quantidadeEstoque: number;
  criadoEm: Date;
  imageUrl: string | null;
}

const EditarBebidas = () => {
  const { data: session } = useSession();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  // Diálogo para a lista de produtos
  const [isListDialogOpen, setIsListDialogOpen] = useState(false);
  // Diálogo para editar um produto
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Estado para gerenciar qual produto está sendo editado e seus campos
  const [editingProduto, setEditingProduto] = useState<Produto | null>(null);
  const [editedFields, setEditedFields] = useState({
    nome: "",
    descricao: "",
    valor: 0,
    quantidadeEstoque: 0,
    imageUrl: "",
  });

  // Carrega os produtos ao montar o componente
  useEffect(() => {
    const fetchProdutos = async () => {
      const data = await getProdutos();
      setProdutos(data);
      setLoading(false);
    };
    fetchProdutos();
  }, []);

  // Abre o diálogo da lista de produtos após verificação de acesso
  const handleOpenListDialog = async () => {
    try {
      if (!session || !session.user || !session.user.email) {
        toast.warning("Você precisa estar logado para acessar esta funcionalidade.");
        return;
      }

      const isAdmin = await isUserAdmin(session.user.email);
      if (!isAdmin) {
        toast.error("Apenas administradores podem editar bebidas.");
        return;
      }

      setIsListDialogOpen(true);
    } catch (error) {
      console.error("Erro ao verificar permissão do usuário:", error);
      toast.error("Erro ao verificar permissão.");
    }
  };

  // Ao clicar no botão de editar, abre o diálogo de edição (novo card)
  const handleEditClick = (produto: Produto) => {
    setEditingProduto(produto);
    setEditedFields({
      nome: produto.nome,
      descricao: produto.descricao || "",
      valor: produto.valor,
      quantidadeEstoque: produto.quantidadeEstoque,
      imageUrl: produto.imageUrl || "",
    });
    setIsEditDialogOpen(true);
  };

  // Atualiza os campos conforme o usuário digita
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedFields((prev) => ({
      ...prev,
      [name]:
        name === "valor" || name === "quantidadeEstoque" ? Number(value) : value,
    }));
  };

  // Salva as alterações feitas no produto
  const handleSave = async () => {
    if (!editingProduto) return;

    try {
      await atualizarBebida({
        id: editingProduto.id,
        ...editedFields,
      })

      toast.success("Bebida atualizada com sucesso!");
      // Atualiza a lista de produtos localmente
      setProdutos((prevProdutos) =>
        prevProdutos.map((produto) =>
          produto.id === editingProduto.id ? { ...produto, ...editedFields } : produto
        )
      );
      setIsEditDialogOpen(false);
      setEditingProduto(null);
    } catch (error) {
      console.error("Erro ao atualizar bebida:", error);
      toast.error("Erro ao atualizar bebida.");
    }
  };

  // Cancela a edição e fecha o diálogo de edição
  const handleCancelEdit = () => {
    setIsEditDialogOpen(false);
    setEditingProduto(null);
  };

  return (
    <>
      {/* Botão para abrir a lista de produtos */}
      <Button className="justify-start gap-2" onClick={handleOpenListDialog}>
        <Edit /> Editar Bebidas
      </Button>

      {/* Diálogo com a lista de produtos */}
      <Dialog open={isListDialogOpen} onOpenChange={setIsListDialogOpen}>
        {isListDialogOpen && (
          <DialogContent className="w-[80%] max-h-[90%] overflow-y-auto [&::-webkit-scrollbar]:hidden rounded-2xl">
            <DialogTitle>Editar Bebidas</DialogTitle>
            <div className="flex flex-col gap-5">
              {loading ? (
                <p>Carregando...</p>
              ) : produtos.length > 0 ? (
                produtos.map((produto) => (
                  <div
                    key={produto.id}
                    className="flex justify-between items-center border p-4 rounded-md"
                  >
                    <div>
                      <p className="font-bold">{produto.nome}</p>
                      <p>{produto.descricao}</p>
                      <p>Valor: R$ {produto.valor.toFixed(2)}</p>
                      <p>Estoque: {produto.quantidadeEstoque}</p>
                    </div>
                    <Button onClick={() => handleEditClick(produto)}>Editar</Button>
                  </div>
                ))
              ) : (
                <p>Nenhum produto encontrado.</p>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Diálogo para edição do produto selecionado */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        {isEditDialogOpen && (
          <DialogContent className="w-[80%] max-h-[90%] overflow-y-auto [&::-webkit-scrollbar]:hidden rounded-2xl">
            <DialogTitle>
              Bebida: {editingProduto ? editingProduto.nome : ""}
            </DialogTitle>
            <div className="flex flex-col gap-4">
              <div>
                <Label
                  htmlFor="nome"
                  className="text-base"
                >
                  Nome
                </Label>
                <Input
                  type="text"
                  id="nome"
                  name="nome"
                  value={editedFields.nome}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <Label
                  htmlFor="descricao"
                  className="text-base"
                >
                  Descrição
                </Label>
                <Input
                  id="descricao"
                  name="descricao"
                  value={editedFields.descricao}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <Label
                  htmlFor="valor"
                  className="text-base"
                >
                  Valor
                </Label>
                <Input
                  type="number"
                  id="valor"
                  name="valor"
                  value={editedFields.valor}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  step="0.01"
                />
              </div>
              <div>
                <Label
                  htmlFor="quantidadeEstoque"
                  className="text-base"
                >
                  Quantidade em Estoque
                </Label>
                <Input
                  type="number"
                  id="quantidadeEstoque"
                  name="quantidadeEstoque"
                  value={editedFields.quantidadeEstoque}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div>
                <Label
                  htmlFor="imageUrl"
                  className="text-base"
                >
                  URL da Imagem
                </Label>
                <Input
                  type="text"
                  id="imageUrl"
                  name="imageUrl"
                  value={editedFields.imageUrl}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-4">
              <Button onClick={handleSave}>Salvar Alterações</Button>
              <Button variant="destructive" onClick={handleCancelEdit}>
                Cancelar
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default EditarBebidas;
